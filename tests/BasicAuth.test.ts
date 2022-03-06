import * as assert from 'assert'
import { BasicAuth } from '../src'

describe('Test BasicAuth', () => {
  it(`makeAuth`, async () => {
    assert.strictEqual(BasicAuth.makeAuth('username', 'password'), 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
  })
})
