import * as assert from 'assert'
import { DiffMapper, injectUrlQueryParams, Signature } from '../src/common'
import * as urlHelper from 'url'

describe('Test MySignature', () => {
  it(`injectUrlQueryParams`, async () => {
    {
      const urlString = 'http://example.com/some'
      const urlString2 = injectUrlQueryParams(urlString)
      assert.equal(urlString, urlString2)
    }

    const urlList = [
      'http://example.com/some',
      'http://example.com/some?',
      'http://example.com/some?a=1',
      'http://example.com/some?a=1&b=2',
    ]
    urlList.forEach((urlString) => {
      const params = { _token1: 'xxx', _token2: 'yyy' }
      const prevUrlObj = urlHelper.parse(urlString, true)
      const prevParams = prevUrlObj.query || {}
      const urlString2 = injectUrlQueryParams(urlString, params)
      const urlObj = urlHelper.parse(urlString2, true)
      console.log(`${urlString} => ${urlString2}`)
      assert.ok(DiffMapper.checkEquals(Object.assign({}, prevParams, params), urlObj.query))
    })
  })

  it(`Normal Test`, async () => {
    const appid = 'abcdefg'
    const secret = '123456'
    const signature = new Signature(secret, 600)
    const expires = signature.getExpires()
    const queryParams: any = {
      x: 123,
      y: 456,
    }
    queryParams['_appid'] = appid
    queryParams['_expires'] = expires

    const method = 'GET'
    const apiPath = '/api/xxx/'
    const body = {
      xxx: 1,
      abc: 'abc',
    }
    queryParams['_token'] = signature.sign(method, apiPath, queryParams, body)
    assert.ok(signature.checkExpires(queryParams))
    assert.ok(signature.checkSign(method, apiPath, queryParams, body))
  })

  it(`generateSignedUrl`, async () => {
    const secret = '123456'
    const signature = new Signature(secret, 600)
    const prevUrl = '/api/xxx/'
    const method = 'POST'
    const queryParams = {
      a: 1,
      b: 2,
    }
    const body = {
      xxx: 1,
      abc: 'abc',
    }
    {
      const signedUrl = signature.generateSignedUrl(method, prevUrl, queryParams, body)
      const urlObj = urlHelper.parse(signedUrl, true)
      assert.ok(signature.checkExpires(urlObj.query))
      assert.ok(signature.checkSign(method, urlObj.pathname as string, urlObj.query, body))
    }
    {
      const bodyContent = JSON.stringify(body)
      const signedUrl = signature.generateSignedUrl(method, prevUrl, queryParams, bodyContent)
      const urlObj = urlHelper.parse(signedUrl, true)
      assert.ok(signature.checkExpires(urlObj.query))
      assert.ok(signature.checkSign(method, urlObj.pathname as string, urlObj.query, bodyContent))
    }
  })
})
