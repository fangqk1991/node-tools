import { RequestFollower } from './RequestFollower'
import { AxiosBuilder } from '@fangcha/app-request'
import { makeUUID } from '../common'

export class ServiceProxy<Config = {}> {
  protected _config: Config
  private _observerClass?: { new (requestId?: string): RequestFollower }

  // 一次性用途
  private _requestId?: string

  constructor(config: Config, observerClass?: { new (requestId?: string): RequestFollower }) {
    this._config = config
    if (observerClass) {
      this._observerClass = observerClass
    }
  }

  public proxyForSession<T extends ServiceProxy<Config>>(this: T, requestId: string): T {
    const proxy = new (this.constructor as any)(this._config, this._observerClass) as T
    proxy._requestId = requestId
    return proxy
  }

  protected onRequestMade(request: AxiosBuilder) {
    const requestId = this._requestId || makeUUID()
    request.addHeader('x-request-id', requestId)
    if (this._observerClass) {
      request.setObserver(new this._observerClass(requestId))
    }
  }
}
