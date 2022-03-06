const uuid = require('uuid/v4')

type Handler = () => Promise<void>
type ErrorHandler = (err: Error) => any

export class SafeTask {
  public readonly taskId: string
  private _errHandler?: ErrorHandler

  public constructor() {
    this.taskId = uuid()
  }

  public static async run(handler: Handler) {
    await new SafeTask().execute(handler)
  }

  public setErrorHandler(handler: ErrorHandler) {
    this._errHandler = handler
    return this
  }

  public async execute(handler: Handler) {
    const start = Date.now()
    try {
      console.info(`SafeTask[${this.taskId}] begin`)
      await handler()
    } catch (e) {
      console.error(e)
      if (this._errHandler) {
        await this._errHandler(e as Error)
      }
    }
    const duration = (Date.now() - start) / 1000
    console.info(`SafeTask[${this.taskId}] time elapsed: ${duration.toFixed(2)}s`)
    process.exit()
  }
}
