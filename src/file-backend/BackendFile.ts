import * as fileType from 'file-type'
import * as readChunk from 'read-chunk'
import * as fs from 'fs'

export class BackendFile {
  public static getFileType(filePath: string) {
    const buffer = readChunk.sync(filePath, 0, fileType.minimumBytes)
    return fileType(buffer) as fileType.FileTypeResult
  }

  public static getFileSize(filePath: string) {
    return fs.statSync(filePath).size
  }

  public static getFileExt(filePath: string) {
    const metadata = this.getFileType(filePath) || {}
    let fileExt: string = metadata.ext || ''
    if (!fileExt) {
      fileExt = filePath.split('.').pop() as string
      if (!/^\w+$/.test(fileExt)) {
        fileExt = ''
      }
    }
    return fileExt
  }

  public static getFileMime(filePath: string) {
    const metadata = this.getFileType(filePath)
    if (!metadata) {
      return ''
    }
    return metadata.mime
  }
}
