import { makeUUID } from '../FuncUtils'
import { Handler } from './ChannelModels'
import { ChannelTaskManager } from './ChannelTaskManager'

export class ChannelTask<T = any> {
  channelId: string
  handler: Handler<T>

  public constructor(handler: Handler<T>) {
    this.channelId = makeUUID()
    this.handler = handler
  }

  public async execute() {
    return ChannelTaskManager.handleInChannel(this.channelId, this.handler)
  }
}
