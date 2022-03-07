import * as fs from 'fs'
import * as shell from 'shelljs'
import * as AWS from 'aws-sdk'

export interface AwsOSSConfig {
  awsConfig: AWS.S3.Types.ClientConfiguration
  bucket: string
}

/**
 * @description 如需使用本模块，请在项目 package.json 的 dependencies 中引入 aws-sdk
 */
export class AwsOSS {
  public _options: AwsOSSConfig
  public _client: AWS.S3

  public constructor(options: AwsOSSConfig) {
    this._options = options
    this._client = new AWS.S3(options.awsConfig)
  }

  public async uploadFile(localPath: string, remotePath: string): Promise<AWS.S3.ManagedUpload.SendData> {
    return new Promise((resolve) => {
      this._client.upload(
        {
          Bucket: this._options.bucket,
          Key: remotePath,
          Body: fs.createReadStream(localPath),
        },
        (s3Err: Error, data: AWS.S3.ManagedUpload.SendData) => {
          if (s3Err) throw s3Err
          resolve(data)
        }
      )
    })
  }

  public async download(remotePath: string, localPath: string): Promise<string> {
    return new Promise((resolve) => {
      this._client.getObject(
        {
          Bucket: this._options.bucket,
          Key: remotePath,
        },
        (err: Error, data: AWS.S3.Types.GetObjectOutput) => {
          if (err) throw err
          const dir = localPath.split('/').slice(0, -1).join('/')
          AwsOSS._mkdirs(dir)
          fs.writeFileSync(localPath, data.Body as any)
          resolve(localPath)
        }
      )
    })
  }

  // public async checkExists(remotePath: string): Promise<boolean> {
  //   try {
  //     await this._client.head(remotePath)
  //     return true
  //   } catch (e) {
  //     if (e.name === 'NoSuchKeyError') {
  //       return false
  //     } else {
  //       throw e
  //     }
  //   }
  // }
  //
  // public async getContent(remotePath: string) {
  //   const response = await this._client.get(remotePath)
  //   return response.content.toString()
  // }
  //
  // public signatureURL(remotePath: string, options: OSS.SignatureUrlOptions = {}) {
  //   let url = this._client.signatureUrl(remotePath, options)
  //   if (this._options.secure) {
  //     url = url.replace(/^http:/, 'https:')
  //   }
  //   return url
  // }

  public static _mkdirs(dir: string) {
    if (!fs.existsSync(dir)) {
      shell.exec(`mkdir -p ${dir}`)
    }
  }
}
