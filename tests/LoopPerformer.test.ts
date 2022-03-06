import { LoopPerformer } from '../src'

describe('Test LoopPerformer.test.ts', () => {
  it(`maxRepeat`, async () => {
    const performer = new LoopPerformer({
      period: 1000,
      errorHandler: (err) => {
        console.error(err)
      },
      maxRepeat: 10,
    })
    await performer.execute(async () => {
      console.info(`第 ${performer.curTimes()} 次执行`)
    })
  })
})
