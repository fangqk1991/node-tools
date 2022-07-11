export interface OAuthClientConfig {
  baseURL: string
  clientId: string
  clientSecret: string
  callbackUri: string
  authorizePath: string
  // Google OAuth 的 authorize、token 所使用的 baseURL 不同
  tokenBaseURL?: string
  tokenPath: string
  logoutPath: string
  /**
   * 授权范围
   */
  scope?: string

  logoutParamKey?: string
}
