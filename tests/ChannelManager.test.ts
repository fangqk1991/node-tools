import { sleep } from '../src'
import * as assert from 'assert'
import { ChannelTask, ChannelTaskManager } from '../src/common/channel'

describe('Test ChannelManager.test.ts', () => {
  it(`Test: multi-execute`, async () => {
    const channelName = 'xxx'
    let matchedResult = 0
    await Promise.all(
      new Array(100).fill(1).map(() => {
        return ChannelTaskManager.handleInChannel(channelName, async () => {
          await sleep(2000)
          return matchedResult++
        }).then((result) => {
          assert.strictEqual(result, 0)
        })
      })
    )
    assert.strictEqual(matchedResult, 1)

    await Promise.all(
      new Array(100).fill(1).map(() => {
        return ChannelTaskManager.handleInChannel(channelName, async () => {
          await sleep(2000)
          return matchedResult++
        }).then((result) => {
          assert.strictEqual(result, 1)
        })
      })
    )
    assert.strictEqual(matchedResult, 2)
  })

  it(`Test: exception`, async () => {
    const channelName = 'xxx'
    let matchedResult = 0
    await Promise.all([
      ChannelTaskManager.handleInChannel(channelName, async () => {
        throw new Error('An Error')
      }).catch((err) => {
        console.info(`Catch Error:`, err.message)
      }),
      ...new Array(100).fill(1).map(() => {
        return ChannelTaskManager.handleInChannel(channelName, async () => {
          await sleep(2000)
          return matchedResult++
        }).then((result) => {
          assert.strictEqual(result, 0)
        })
      }),
    ])
    assert.strictEqual(matchedResult, 1)
  })

  it(`Test: ChannelTask`, async () => {
    let matchedResult = 0
    const task = new ChannelTask(async () => {
      await sleep(2000)
      return matchedResult++
    })
    await Promise.all(
      new Array(100).fill(1).map(() => {
        return task.execute().then((result) => {
          assert.strictEqual(result, 0)
        })
      })
    )
    assert.strictEqual(matchedResult, 1)
    console.info(ChannelTaskManager)
  })
})
