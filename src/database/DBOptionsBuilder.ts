import { logger } from '@fangcha/logger'
import * as assert from 'assert'
import { Options } from 'sequelize'

type OnSlowQueryCallback = (query: string, ms: number) => void

export class DBOptionsBuilder {
  private readonly rawOptions: Options
  /**
   * @description 慢查询阈值，单位毫秒(ms)
   */
  private slowThreshold = 1000
  private onSlowQueryCallback?: OnSlowQueryCallback

  public constructor(
    rawOptions: {
      host: string
      port: number
      database: string
      username: string
      password: string
      dialect: string
      timezone?: string
      logging?: boolean | Function
    },
    onSlowQueryCallback?: OnSlowQueryCallback
  ) {
    this.rawOptions = rawOptions as Options
    this.onSlowQueryCallback = onSlowQueryCallback
  }

  /**
   * @param msValue 单位: ms
   */
  public setSlowThreshold(msValue: number) {
    assert.ok(msValue > 0, 'slowThreshold should > 0ms')
    this.slowThreshold = msValue
    return this
  }

  public build() {
    const logSlowQuery = (query: string, ms: number) => {
      if (ms >= this.slowThreshold) {
        logger.warn(`SLOW QUERY (${ms}ms): ${query}`)
        if (this.onSlowQueryCallback) {
          this.onSlowQueryCallback(query, ms)
        }
      }
    }
    return {
      ...this.rawOptions,
      logging: this.rawOptions.logging ? console.info : logSlowQuery,
      benchmark: true,
    } as Options
  }
}
