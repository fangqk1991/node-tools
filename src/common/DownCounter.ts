import { sleep } from './FuncUtils'

type StepCallback = (remainSteps: number) => void | Promise<void>
type NormalCallback = () => void | Promise<void>

export class DownCounter {
  private _running = false
  private _step = 1
  private _total = 0
  private _remain = 0

  constructor() {}

  public setTotalSeconds(totalSeconds: number, step = 1) {
    this._running = false
    this._total = totalSeconds
    this._remain = totalSeconds
    this._step = step
  }

  public reset() {
    this._running = false
    this._remain = this._total
  }

  public isRunning() {
    return this._running
  }

  private _stepCallback?: StepCallback
  public setOnStepCallback(callback: StepCallback) {
    this._stepCallback = callback
  }

  private _doneCallback?: NormalCallback
  public setOnDoneCallback(callback: NormalCallback) {
    this._doneCallback = callback
  }

  public async execute() {
    if (this._running) return

    this._running = true
    while (this._remain > 0) {
      if (this._stepCallback) {
        await this._stepCallback(this._remain)
      }
      this._remain -= this._step
      await sleep(this._step * 1000)
    }

    if (this._doneCallback) {
      await this._doneCallback()
    }
    this.reset()
  }
}
