import { ApiOptions, axiosBuilder } from '@fangcha/app-request'
import AppError from '@fangcha/app-error'
import { OAuthClientConfig } from './OAuthClientConfig'
import { AxiosProxyConfig } from 'axios'
import * as tunnel from 'tunnel'
import { ServiceProxy } from '../request'
import { OAuthToken } from './OAuthModels'

export class OAuthClient extends ServiceProxy<OAuthClientConfig> {
  private _proxyConfig?: AxiosProxyConfig | false
  public setProxy(proxy: AxiosProxyConfig | false) {
    this._proxyConfig = proxy
  }

  public proxyForSession<T>(this: T, requestId: string): T {
    const proxy = super.proxyForSession(requestId) as OAuthClient
    const _this = this as any as OAuthClient
    if (_this._proxyConfig) {
      proxy.setProxy(_this._proxyConfig)
    }
    return proxy as any as T
  }

  public buildLogoutUrl(redirectUri: string) {
    const request = this.makeRequest({
      method: 'GET',
      route: this._config.logoutPath,
      description: 'Logout',
    })
    const paramKey = this._config.logoutParamKey || 'redirect_uri'
    const params: any = {
      [paramKey]: redirectUri,
    }
    request.setQueryParams(params)
    return request.getRequestUrl()
  }

  public getAuthorizeUri(state?: string, extrasQuery?: {}) {
    const request = this.makeRequest({
      method: 'GET',
      route: this._config.authorizePath,
      description: '获取 OAuth 授权 Uri 地址',
    })
    const params: any = {
      response_type: 'code',
      client_id: this._config.clientId,
      redirect_uri: this._config.callbackUri,
      ...(extrasQuery || {}),
    }
    if (this._config.scope) {
      params.scope = this._config.scope
    }
    if (state) {
      params.state = state
    }
    request.setQueryParams(params)
    return request.getRequestUrl()
  }

  public async getAccessTokenFromCode(code: string) {
    const tokenData = await this.getAccessTokenData(code)
    return tokenData.access_token
  }

  public async getAccessTokenData(code: string) {
    const request = this.makeRequest({
      method: 'POST',
      route: this._config.tokenPath,
      description: '请求 OAuth Token',
    })
    if (this._config.tokenBaseURL) {
      request.setBaseURL(this._config.tokenBaseURL)
    }
    request.setFormUrlEncoded({
      client_id: this._config.clientId,
      client_secret: this._config.clientSecret,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this._config.callbackUri,
    })
    return (await request.quickSend()) as OAuthToken
  }

  public async refreshAccessToken(refreshToken: string) {
    const request = this.makeRequest({
      method: 'POST',
      route: this._config.tokenPath,
      description: '请求 OAuth Token',
    })
    if (this._config.tokenBaseURL) {
      request.setBaseURL(this._config.tokenBaseURL)
    }
    request.setFormUrlEncoded({
      client_id: this._config.clientId,
      client_secret: this._config.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    })
    return (await request.quickSend()) as OAuthToken
  }

  protected makeRequest(commonApi: ApiOptions) {
    const request = axiosBuilder().setBaseURL(this._config.baseURL).setApiOptions(commonApi).setTimeout(15000)
    request.addHeader('Accept', 'application/json')
    this.onRequestMade(request)
    if (this._proxyConfig) {
      if (request.getRequestUrl().startsWith('https://')) {
        const httpsAgent = tunnel.httpsOverHttp({ proxy: this._proxyConfig })
        request.addAxiosConfig({
          proxy: false,
          httpsAgent: httpsAgent,
        })
      } else {
        request.addAxiosConfig({
          proxy: this._proxyConfig,
        })
      }
    }
    const errorPrefix = `API[${commonApi.description}] error:`
    request.setErrorParser((_client, error) => {
      const message = error.message
      return new AppError(`${errorPrefix} ${message}`, 500, error.extras)
    })
    return request
  }
}
