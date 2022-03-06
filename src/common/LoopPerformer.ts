import { SafePerformer } from './SafePerformer'
import { sleep } from './FuncUtils'

type Handler = () => Promise<void>
type ErrorHandler = (err: Error) => any

interface Options {
  period: number // 单位：ms，默认 60 * 1000ms
  errorHandler: ErrorHandler
  maxRepeat: number
}

export class LoopPerformer {
  private readonly _options: Options
  private _curTimes = 0

  public constructor(options: Partial<Options> = {}) {
    this._options = {
      period: options.period || 1000 * 60,
      errorHandler:
        options.errorHandler ||
        ((e) => {
          console.error(e)
        }),
      maxRepeat: options.maxRepeat || -1,
    }
  }

  public curTimes() {
    return this._curTimes
  }

  private _running = false
  public async execute(handler: Handler) {
    if (this._running) {
      return
    }
    this._running = true
    const performer = SafePerformer.performerWithErrorHandler(this._options.errorHandler)

    const checkTrue =
      this._options.maxRepeat === -1
        ? () => {
            return true
          }
        : () => {
            return this._curTimes < this._options.maxRepeat
          }
    while (checkTrue()) {
      ++this._curTimes
      await performer.perform(async () => {
        await handler()
      })
      await sleep(this._options.period)
    }
    this._running = false
  }
}
