import * as assert from 'assert'
import { JsonChecker } from '..'

describe('Test JsonChecker', () => {
  it(`Test checkJSON`, async () => {
    assert.strictEqual(JsonChecker.checkJSON('{}'), true)
    assert.strictEqual(JsonChecker.checkJSON('[]'), true)
    assert.strictEqual(JsonChecker.checkJSON('[1, 2]'), true)
    assert.strictEqual(JsonChecker.checkJSON('[1, "2"]'), true)
    assert.strictEqual(JsonChecker.checkJSON('{ a: 1 }'), false)
    assert.strictEqual(JsonChecker.checkJSON('{ "a": 1 }'), true)
    assert.strictEqual(JsonChecker.checkJSON('undefined'), false)
    assert.strictEqual(JsonChecker.checkJSON(''), false)
    assert.strictEqual(JsonChecker.checkJSON('123'), false)
    assert.strictEqual(JsonChecker.checkJSON('null'), false)
  })
})
