import * as assert from 'assert'
import { DiffMapper, DiffType } from '../src/common'

const fromObj = {
  unchangedStr: '123',
  unchangedNumber: 123,
  changedStr: '123',
  oldNumber: 123,
  unchangedObj: {
    a: 1,
  },
  changedObj: {
    a: 1,
    b: 2,
    d: {},
  },
  arr: [1, 2, 3],
  keyObject1: {
    a: 1,
    b: 2,
  },
  keyObject3: {
    child: [0, 2, 3, 4],
  },
  notKeyObject3: {
    child: [0, 2, 3, 4],
  },
  keyObject4: {
    a: 1,
    b: 1,
  },
  keyObject5: {
    a: 1,
    b: 1,
  },
  keyObject6: {
    a: 1,
    b: 1,
    keyObject7: {
      a: 1,
      b: 2,
    }
  },
  keyObject8: [
    1, 2, 3, 5, { xx: 2 }
  ],
}
const toObj = {
  unchangedStr: '123',
  unchangedNumber: 123,
  changedStr: '456',
  newNumber: 123,
  unchangedObj: {
    a: 1,
  },
  changedObj: {
    a: 2,
    c: 3,
    d: {},
    e: {
      ee: {
        eee: 1
      }
    }
  },
  arr: [1, 1, 2, 3],
  keyObject1: {
    a: 1,
    b: 1,
  },
  keyObject2: {
    a: 1,
    b: 1,
  },
  keyObject3: {
    child: [1, 2, 3, 4],
  },
  notKeyObject3: {
    child: [1, 2, 3, 4],
  },
  keyObject4: {
    a: 1,
    b: 1,
  },
  keyObject6: {
    a: 1,
    b: 1,
    keyObject7: {
      a: 1,
      b: 1,
    }
  },
  keyObject8: [
    1, 2, 3, 4, { xx: 1 }
  ],
}

describe('Test DiffMapper', () => {
  it(`buildCompareMap`, async () => {
    const mapper = new DiffMapper(fromObj, toObj)
    mapper.addSpecialKeychain(['keyObject1'])
    mapper.addSpecialKeychain(['keyObject2'])
    mapper.addSpecialKeychain(['keyObject3'])
    mapper.addSpecialKeychain(['keyObject4'])
    mapper.addSpecialKeychain(['keyObject6', 'keyObject7'])
    const result = mapper.buildCompareMap()
    // console.log(result)
    assert.ok(result['unchangedStr'])
    assert.ok(result['unchangedStr']['type'] === DiffType.Unchanged)
    assert.ok(result['unchangedNumber'])
    assert.ok(result['unchangedNumber']['type'] === DiffType.Unchanged)
    assert.ok(result['changedStr'])
    assert.ok(result['changedStr']['type'] === DiffType.Updated)
    assert.ok(result['changedObj'])
    assert.ok(result['unchangedObj'])
    assert.ok(result['oldNumber'])
    assert.ok(result['oldNumber']['type'] === DiffType.Deleted)
    assert.ok(result['newNumber'])
    assert.ok(result['newNumber']['type'] === DiffType.Created)
    assert.ok(result['notKeyObject3'])
    assert.ok(!result['notKeyObject3']['type'])
    assert.ok(result['keyObject1'])
    assert.ok(result['keyObject1']['type'] === DiffType.Updated)
    assert.ok(result['keyObject2'])
    assert.ok(result['keyObject2']['type'] === DiffType.Created)
    assert.ok(result['keyObject3'])
    assert.ok(result['keyObject3']['type'] === DiffType.Updated)
    assert.ok(result['keyObject4'])
    assert.ok(result['keyObject4']['type'] === DiffType.Unchanged)
    assert.ok(result['keyObject5'])
    assert.ok(result['keyObject5']['type'] === DiffType.Deleted)
    assert.ok(result['keyObject6'])
    assert.ok(result['keyObject6']['keyObject7'])
    assert.ok(result['keyObject6']['keyObject7']['type'] === DiffType.Updated)
  })

  it(`specialKeychain - root`, async () => {
    const mapper = new DiffMapper(fromObj, toObj)
    mapper.addSpecialKeychain([])
    const result = mapper.buildCompareMap()
    assert.ok(result)
    assert.ok(result['type'] === DiffType.Updated)
  })

  it(`specialKeychain - have common sub chain`, async () => {
    {
      const mapper = new DiffMapper(fromObj, toObj)
      mapper.addSpecialKeychain(['keyObject6', 'keyObject7'])
      mapper.addSpecialKeychain(['keyObject6'])
      const result = mapper.buildCompareMap()
      assert.ok(result['keyObject6'])
      assert.ok(result['keyObject6']['type'] === DiffType.Updated)
    }
    {
      const mapper = new DiffMapper(fromObj, toObj)
      mapper.addSpecialKeychain(['keyObject6'])
      mapper.addSpecialKeychain(['keyObject6', 'keyObject7'])
      const result = mapper.buildCompareMap()
      assert.ok(result['keyObject6'])
      assert.ok(result['keyObject6']['type'] === DiffType.Updated)
    }
  })

  it(`specialKeychain - regex`, async () => {
    {
      const mapper = new DiffMapper(fromObj, toObj)
      mapper.addSpecialKeychain(['keyObject6', /^.*$/])
      mapper.addSpecialKeychain(['keyObject6'])
      mapper.addSpecialKeychain(['keyObject6', 'noExists'])
      mapper.addSpecialKeychain(['noExists'])
      mapper.addSpecialKeychain(['keyObject8', /^.*$/])
      mapper.addSpecialKeychain(['nothing1', '123'])
      mapper.addSpecialKeychain(['nothing2', /^.*$/])
      const result = mapper.buildCompareMap()
      assert.ok(result['keyObject6'])
      assert.ok(result['keyObject6']['type'] === DiffType.Updated)
      assert.ok(result['keyObject8'])
      Object.keys(result['keyObject8']).forEach((key) => {
        assert.ok(result['keyObject8'][key])
        assert.ok(result['keyObject8'][key]['type'])
      })
    }
  })

  it(`buildDiffMap`, async () => {
    const mapper = new DiffMapper(fromObj, toObj)
    const result = mapper.buildDiffMap()
    assert.ok(!result['unchangedStr'])
    assert.ok(!result['unchangedNumber'])
    assert.ok(!result['unchangedNumber'])
    assert.ok(result['changedStr'])
    assert.ok(result['changedStr']['type'] === DiffType.Updated)
    assert.ok(result['changedObj'])
    assert.ok(!result['unchangedObj'])
    assert.ok(result['oldNumber'])
    assert.ok(result['oldNumber']['type'] === DiffType.Deleted)
    assert.ok(result['newNumber'])
    assert.ok(result['newNumber']['type'] === DiffType.Created)
  })

  it(`buildCompareItems`, async () => {
    const mapper = new DiffMapper(fromObj, toObj)
    const compareItems = mapper.buildCompareItems()
    compareItems.forEach((item) => {
      let fromItem: any = fromObj
      let toItem: any = toObj
      item.keychain.forEach((key) => {
        fromItem = fromItem[key]
        toItem = toItem[key]
      })

      if (item.type === DiffType.Unchanged) {
        assert.equal(fromItem, toItem)
      } else {
        assert.notEqual(fromItem, toItem)
      }

      assert.equal(item.from, fromItem)
      assert.equal(item.to, toItem)
    })
  })

  it(`buildDiffItems`, async () => {
    const mapper = new DiffMapper(fromObj, toObj)
    const diffItems = mapper.buildDiffItems()
    diffItems.forEach((item) => {
      assert.notEqual(item.type, DiffType.Unchanged)
    })
  })

  it(`checkEquals`, async () => {
    const mapper = new DiffMapper({ a: 1 }, { a: 1 })
    assert.ok(mapper.checkNoChanges())
    assert.ok(DiffMapper.checkEquals({ a: 1 }, { a: 1}))
  })
})
