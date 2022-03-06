import { GuardPerformer } from '../src'
import * as assert from 'assert'

describe('Test GuardPerformer.test.ts', () => {
  it(`perform 1`, async () => {
    const data = await GuardPerformer.perform(async () => {
      return '!!!'
    })
    assert.ok(data, '!!!')
  })

  it(`perform 2`, async () => {
    let curIndex = 0
    const data = await GuardPerformer.perform(async () => {
      ++curIndex
      if (curIndex === 3) {
        return '!!!'
      }
      throw new Error(`第 ${curIndex} 次报错`)
    })
    assert.ok(data, '!!!')
  })
})
