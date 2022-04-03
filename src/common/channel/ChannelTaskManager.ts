import { sleep } from '../FuncUtils'
import { ChannelEntity, Handler } from './ChannelModels'

class _ChannelManager {
  private _entityMap: { [channelId: string]: ChannelEntity } = {}

  public constructor() {}

  public async handleInChannel<T = any>(channelId: string, handler: Handler<T>) {
    if (!this._entityMap[channelId]) {
      this._entityMap[channelId] = {
        isRunning: false,
        isDone: false,
        pendingCount: 0,
      }
    }
    await sleep(0)
    await this._wait(channelId)
    if (this._entityMap[channelId].isDone) {
      const result = this._entityMap[channelId].result as T
      this._dispose(channelId)
      return result
    }
    this._entityMap[channelId].isRunning = true
    await sleep(0)
    const result = await handler().catch((err) => {
      Object.assign(this._entityMap[channelId], {
        isRunning: false,
        isDone: false,
      })
      this._dispose(channelId)
      throw err
    })
    Object.assign(this._entityMap[channelId], {
      isRunning: false,
      isDone: true,
      result: result,
    })
    this._dispose(channelId)
    return result
  }

  private async _wait(channelId: string) {
    ++this._entityMap[channelId].pendingCount
    while (this._entityMap[channelId].isRunning) {
      await sleep(100)
    }
    --this._entityMap[channelId].pendingCount
  }

  private _dispose(channelId: string) {
    if (this._entityMap[channelId].pendingCount === 0) {
      delete this._entityMap[channelId]
      // console.debug(`Channel[${channelId}] released.`)
    }
  }
}

export const ChannelTaskManager = new _ChannelManager()
