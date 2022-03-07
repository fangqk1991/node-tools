import * as SparkMD5 from 'spark-md5'

export class FrontendFile {
  public static async computeFileHash(file: File): Promise<string> {
    return new Promise((resolve: Function, _reject: Function) => {
      const filePrototype = File.prototype as any
      const blobSlice = filePrototype.slice || filePrototype.mozSlice || filePrototype.webkitSlice
      const chunkSize = 1024 * 1024 * 2
      const chunks = Math.ceil(file.size / chunkSize)
      let currentChunk = 0
      let fileHash = ''
      const spark = new SparkMD5.ArrayBuffer()
      const fileReader = new FileReader()
      const loadNext = () => {
        const start = currentChunk * chunkSize
        const end = start + chunkSize >= file.size ? file.size : start + chunkSize
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
      }
      fileReader.onload = (e: any) => {
        spark.append(e.target.result)
        currentChunk++
        if (currentChunk < chunks) {
          loadNext()
        } else {
          fileHash = spark.end()
          resolve(fileHash)
        }
      }
      loadNext()
    })
  }

  public static computeFileExt(file: File) {
    return file.name.includes('.') ? file.name.split('.').pop()!.replace(/\s+/g, '') : ''
  }

  public static computeFileMimeType(file: File) {
    return file.type || 'application/octet-stream'
  }
}
