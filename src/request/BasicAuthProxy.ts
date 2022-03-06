import { ApiOptions, axiosBuilder } from '@fangcha/app-request'
import { ServiceProxy } from './ServiceProxy'
import { RequestFollower } from './RequestFollower'
import { BasicAuth, BasicAuthConfig } from '../common'

export class BasicAuthProxy extends ServiceProxy<BasicAuthConfig> {
  private readonly _authorization: string

  public constructor(config: BasicAuthConfig, observerClass?: { new (requestId?: string): RequestFollower }) {
    super(config, observerClass)
    this._authorization = BasicAuth.makeAuth(config.username, config.password)
  }

  public makeRequest(commonApi: ApiOptions) {
    const request = axiosBuilder()
      .setBaseURL(this._config.urlBase)
      .addHeader('Authorization', this._authorization)
      .setApiOptions(commonApi)
      .setTimeout(15000)
    this.onRequestMade(request)
    return request
  }
}
