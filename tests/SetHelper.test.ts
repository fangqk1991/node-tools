import { SetHelper } from '../src/common/SetHelper'

describe('Test SetHelper.test.ts', () => {
  it(`getUnionSet`, async () => {
    const a = new Set([1, 2, 3])
    const b = new Set([4, 3, 2])
    console.info(SetHelper.getUnionSet(a, b))
  })

  it(`getIntersection`, async () => {
    const a = new Set([1, 2, 3])
    const b = new Set([4, 3, 2])
    console.info(SetHelper.getIntersection(a, b))
  })
})
