import { CsvMaker } from '../src'

describe('Test CsvMaker', () => {
  it(`makeContent`, async () => {
    const maker = new CsvMaker()
    maker.setColumns(['a', 'b'])
    maker.pushData({
      a: 123,
    })
    console.info(maker.makeContent())
  })
})
