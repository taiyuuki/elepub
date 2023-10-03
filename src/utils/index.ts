import { str_random } from '@taiyuuki/utils'

export function getRandomName(fileName?: string) {
    if (fileName) {
        return str_random(12) + fileName.substring(fileName.lastIndexOf('.'))
    }
    return str_random(12)
}

export function getFileName(path: string) {
    return path.substring(path.lastIndexOf('\\') + 1)
}

export function getFileExt(filename: string) {
    return filename.substring(filename.lastIndexOf('.') + 1)
}

export function ensureNoExt(filename: string) {
    return filename.substring(0, filename.lastIndexOf('.'))
}

export function getMinetype(filename: string) {
    const imageExt = filename.substring(filename.lastIndexOf('.'))
    let imageType = ''
    imageType = imageExt === '.svg' ? 'image/svg+xml' : imageType
    imageType = imageExt === '.png' ? 'image/png' : imageType
    imageType
    = imageExt === '.jpg' || imageExt === '.jpeg' ? 'image/jpeg' : imageType
    imageType = imageExt === '.gif' ? 'image/gif' : imageType
    imageType
    = imageExt === '.tif' || imageExt === '.tiff' ? 'image/tiff' : imageType
    return imageType
}
