type Handler = () => Promise<void>
type ErrorHandler = (err: Error) => any

export class SafePerformer {
  private _errHandler: ErrorHandler

  private constructor(errHandler: ErrorHandler) {
    this._errHandler = errHandler
  }

  public static performerWithErrorHandler(errHandler: ErrorHandler) {
    return new SafePerformer(errHandler)
  }

  public async perform(handler: Handler) {
    try {
      await handler()
    } catch (e) {
      if (this._errHandler) {
        await this._errHandler(e as Error)
      }
    }
  }
}
