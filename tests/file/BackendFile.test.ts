import * as assert from 'assert'
import { BackendFile } from '../../src/file-backend'

describe('Test BackendFile.test.ts', () => {
  it(`getFileExt`, async () => {
    const fileExt = BackendFile.getFileExt(__filename)
    assert.equal(fileExt, 'ts')
  })

  it(`getFileSize`, async () => {
    console.info(BackendFile.getFileSize(__filename))
  })
})
