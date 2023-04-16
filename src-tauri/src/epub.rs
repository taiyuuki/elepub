use serde::Deserialize;
use std::{fs::File, io::prelude::*};
use zip::write::FileOptions;

mod template;

pub enum FileContent {
    Text(String),
    ImagePath(String),
}

use FileContent::{ImagePath, Text};

pub enum Compression {
    Store,
    Zip,
}

pub struct EpubFile {
    pub dir: String,
    pub name: String,
    pub content: FileContent,
    pub compress: Compression,
}

impl EpubFile {
    pub fn new(dir: &str, name: &str, content: FileContent, compress: Compression) -> EpubFile {
        EpubFile {
            dir: String::from(dir),
            name: String::from(name),
            content,
            compress,
        }
    }
}

#[derive(Deserialize)]
pub struct Image {
    title: String,
    xhtml: String,
    name: String,
    path: String,
    index: bool,
    mime: String,
}

#[derive(Deserialize)]
pub struct Metadata {
    pub id: String,
    pub cover: Image,
    pub title: String,
    pub author: String,
    pub images: Vec<Image>,
    pub output: String,
    pub creator: String,
    pub volume: String,
    pub publisher: String,
    pub description: String,
    pub date: String,
}

fn get_image(image: &Image) -> EpubFile {
    let image_path = String::from(&image.path);
    EpubFile::new(
        "OEBPF/images/",
        &image.name,
        ImagePath(image_path),
        Compression::Zip,
    )
}

fn get_mimetype() -> EpubFile {
    EpubFile::new(
        "",
        "mimetype",
        Text("application/epub+zip".to_string()),
        Compression::Store,
    )
}

fn get_duokan_extension() -> EpubFile {
    EpubFile::new(
        "META-INF/",
        "duokan-extension.xml",
        Text(String::from(template::MIMETYPE)),
        Compression::Zip,
    )
}

fn get_container() -> EpubFile {
    EpubFile::new(
        "META-INF/",
        "container.xml",
        Text(String::from(template::CONTAINER)),
        Compression::Zip,
    )
}

fn get_section(image: &Image) -> EpubFile {
    EpubFile::new(
        "OEBPF/content/",
        &image.xhtml,
        Text(
            template::SECTION
                .replace("{title}", &image.title)
                .replace("{image}", &image.name),
        ),
        Compression::Zip,
    )
}

fn get_css() -> EpubFile {
    EpubFile::new(
        "OEBPF/css/",
        "ebook.css",
        Text(String::from(template::CSS)),
        Compression::Zip,
    )
}

fn get_cover(image: &Image) -> EpubFile {
    EpubFile::new(
        "OEBPF/",
        "cover.xhtml",
        Text(
            template::COVER
                .replace("{title}", &image.title)
                .replace("{cover}", &image.name),
        ),
        Compression::Zip,
    )
}

fn get_message(meta: &Metadata) -> EpubFile {
    EpubFile::new(
        "OEBPF/content/",
        "msg.xhtml",
        Text(
            template::MESSAGE
                .replace("{title}", &meta.title)
                .replace("{author}", &meta.author)
                .replace("{creator}", &meta.creator)
                .replace("{volume}", &meta.volume),
        ),
        Compression::Zip,
    )
}

fn get_opf(meta: &Metadata) -> EpubFile {
    let mut opf_file = String::new();
    opf_file += r#"<?xml version='1.0' encoding='utf-8'?>
    <package xmlns='http://www.idpf.org/2007/opf' version='2.0' unique-identifier='duokan-book-id'>
      <metadata xmlns:dc='http://purl.org/dc/elements/1.1/' xmlns:opf='http://www.idpf.org/2007/opf'>"#;
    opf_file += &format!(
        "        <dc:title>{}{}</dc:title>\n",
        &meta.title, &meta.volume
    );
    opf_file += &format!(
        "        <dc:identifier id='duokan-book-id' opf:scheme='URI'>{}</dc:identifier>\n",
        &meta.id
    );
    opf_file += "        <dc:language>zh-CN</dc:language>\n";
    opf_file += &format!(
        "        <dc:creator opf:role='aut' opf:file-as='undefined'>{}</dc:creator>\n",
        &meta.author
    );
    opf_file += &format!("        <dc:publisher>{}</dc:publisher>\n", &meta.publisher);
    opf_file += &format!(
        "        <dc:description>{}</dc:description>\n",
        &meta.description
    );
    opf_file += &format!(
        "        <dc:date opf:event='modification'>{}</dc:date>\n",
        &meta.date
    );
    opf_file += r#"        <dc:rights>undefined</dc:rights>
        <meta name='calibre:series_index' content='1'/>
        <meta name='cover' content='cover-image'/>
      </metadata>
      <manifest>
"#;
    opf_file += &format!(
        "        <item id='cover-image' media-type='image/jpeg' href='images/{}'/>\n",
        &meta.cover.name
    );
    opf_file += r#"        <item id='cover' media-type='application/xhtml+xml' href='cover.xhtml'/>
        <item id='navigation' media-type='application/x-dtbncx+xml' href='navigation.ncx'/>
        <item id='s1' media-type='application/xhtml+xml' href='content/msg.xhtml'/>
"#;
    let mut i = 2;
    for image in &meta.images {
        opf_file += &format!(
            "        <item id='s{}' media-type='application/xhtml+xml' href='content/{}'/>\n",
            i, &image.xhtml
        );
        i += 1;
    }
    opf_file += "        <item id='css' media-type='text/css' href='css/ebook.css'/>\n";
    i = 0;
    for image in &meta.images {
        opf_file += &format!(
            "        <item id='img{}' media-type='{}' href='images/{}'/>\n",
            i, &image.mime, &image.name
        );
        i += 1;
    }
    opf_file += &format!(
        "        <item id='img{}' media-type='{}' href='images/{}'/>\n",
        i, &meta.cover.mime, &meta.cover.name
    );
    opf_file += r#"      </manifest>
      <spine toc='navigation'>
        <itemref idref='cover' linear='yes' properties='duokan-page-fullscreen'/>
        <itemref idref='s1' />
"#;
    i = 2;
    for _image in &meta.images {
        opf_file += &format!("        <itemref idref='s{}' />\n", i);
        i += 1;
    }
    opf_file += r#"      </spine>
    </package>"#;
    EpubFile::new("OEBPF/", "ebook.opf", Text(opf_file), Compression::Zip)
}

fn get_ncx(meta: &Metadata) -> EpubFile {
    let mut ncx_file = String::new();
    ncx_file += r#"<?xml version='1.0' encoding='UTF-8'?>
<!DOCTYPE ncx PUBLIC '-//NISO//DTD ncx 2005-1//EN' 'http://www.daisy.org/z3986/2005/ncx-2005-1.dtd'>
<ncx xmlns='http://www.daisy.org/z3986/2005/ncx/'>
<head>
"#;
    ncx_file += &format!("  <meta name='dtb:uid' content='{}'/>\n", &meta.id);
    ncx_file += r#"  <meta name='dtb:depth' content='1'/>
  <meta name='dtb:totalPageCount' content='0'/>
  <meta name='dtb:maxPageNumber' content='0'/>
</head>
"#;
    ncx_file += &format!("<docTitle><text>{}</text></docTitle>\n", &meta.title);
    ncx_file += &format!("<docAuthor><text>{}</text></docAuthor>\n", &meta.author);
    ncx_file += r#"<navMap>
<navPoint id='cover' playOrder='1'>
  <navLabel><text>Cover</text></navLabel>
  <content src='cover.xhtml'/>
</navPoint>
"#;
    let mut i = 2;
    let mut o = 2;
    for image in &meta.images {
        if image.index {
            ncx_file += &format!("  <navPoint id='s{}' playOrder='{}'>\n", i, o);
            ncx_file += &format!("    <navLabel><text>{}</text></navLabel>\n", &image.title);
            ncx_file += &format!("    <content src='content/{}'/>\n", &image.xhtml);
            ncx_file += "  </navPoint>\n";
            o += 1;
        }
        i += 1;
    }
    ncx_file += "</navMap>\n";
    ncx_file += "</ncx>";
    EpubFile::new("OEBPF/", "navigation.ncx", Text(ncx_file), Compression::Zip)
}

pub struct Epub {
    pub id: String,
    pub author: String,
    pub files: Vec<EpubFile>,
    pub output: String,
}

impl Epub {
    pub fn new(meta: Metadata) -> Epub {
        let mut files: Vec<EpubFile> = vec![];
        files.push(get_mimetype());
        files.push(get_duokan_extension());
        files.push(get_container());
        files.push(get_opf(&meta));
        files.push(get_ncx(&meta));
        files.push(get_css());
        files.push(get_cover(&meta.cover));
        files.push(get_image(&meta.cover));
        files.push(get_message(&meta));
        for image in &meta.images {
            files.push(get_section(&image));
            files.push(get_image(&image));
        }
        Epub {
            id: meta.id,
            author: meta.author,
            files,
            output: meta.output,
        }
    }
    pub fn generate_epub<F>(&mut self, get_progress: F) -> zip::result::ZipResult<()>
    where
        F: Fn(f32) -> (),
    {
        let file = std::fs::File::create(&self.output).unwrap();
        let mut zip = zip::ZipWriter::new(file);

        let option_zip = FileOptions::default()
            .compression_method(zip::CompressionMethod::Deflated)
            .compression_level(Some(1));
        let option_store =
            FileOptions::default().compression_method(zip::CompressionMethod::Stored);
        let mut i = 0;
        for file in &self.files {
            get_progress(i as f32 / self.files.len() as f32);
            zip.start_file(
                format!("{}{}", file.dir, file.name),
                match file.compress {
                    Compression::Zip => option_zip,
                    Compression::Store => option_store,
                },
            )?;
            match &file.content {
                Text(c) => {
                    zip.write_all(c.as_bytes())?;
                }
                ImagePath(path) => {
                    let mut file = match File::open(path) {
                        Ok(f) => f,
                        Err(_) => {
                            zip.write("文件不存在".as_bytes())?;
                            continue;
                        }
                    };
                    let mut data = vec![];
                    file.read_to_end(&mut data).expect("图片读取失败");
                    zip.write_all(&data)?;
                }
            };
            i += 1;
        }
        zip.finish()?;

        Ok(())
    }
}
