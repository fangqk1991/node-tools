import * as assert from 'assert'
import { addSlashes, bitArray2Integer, integer2BitArray, makeRandomStr } from '../src'

describe('Test FuncUtils', () => {
  it(`addSlashes`, async () => {
    assert.strictEqual(addSlashes('agora 888'), 'agora 888')
    assert.strictEqual(addSlashes('agora "888"'), 'agora \\"888\\"')
    assert.strictEqual(addSlashes(`agora "888" '999'`), `agora \\"888\\" \\'999\\'`)
  })

  it(`makeRandomStr`, async () => {
    console.info(makeRandomStr(32))
    console.info(makeRandomStr(32))
    console.info(makeRandomStr(64))
  })

  it(`bitArray / Number`, async () => {
    assert.strictEqual(bitArray2Integer([1, 3, 4]), 26)
    assert.strictEqual(bitArray2Integer(integer2BitArray(26)), 26)
  })
})
