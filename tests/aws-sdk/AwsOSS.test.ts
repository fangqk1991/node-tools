// import { logger } from '@fangcha/logger'
// import * as assert from 'assert'
// import { AwsOSS } from '../../src/aws-sdk'
// import { md5 } from '../../src'
//
// describe('Test AwsOSS', () => {
//   it(`AwsOSS`, async () => {
//     const awsOss = new AwsOSS({} as any)
//     const filePath = `${__dirname}/test.txt`
//     const remotePath = md5(filePath)
//     logger.info(filePath, remotePath)
//     const response = await awsOss.uploadFile(filePath, remotePath)
//     assert.ok(response.Key === remotePath)
//
//     const localPath = `${DevFuncUtils.doveDownloadDir()}/test2.txt`
//     const localPath2 = await awsOss.download(response.Key, localPath)
//     assert.ok(localPath === localPath2)
//   })
// })
