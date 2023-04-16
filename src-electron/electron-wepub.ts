import Epub from 'wepub'
const buildEpub = async (epubDate: EpubData, callback?: OnProgressUpdata) => {
  const epub = new Epub()
  epub.setMeta(epubDate.metadata)
  epub.addImagesAll(epubDate.images)
  epub.addCss(epubDate.css)
  epub.addSectionsAll(epubDate.sections)
  if (epubDate.customFiles.length > 0) {
    epubDate.customFiles.forEach((customFile) => {
      epub.addCustomFile(customFile)
    })
  }
  await epub.build(epubDate.output, callback)
  return true
}
export default buildEpub