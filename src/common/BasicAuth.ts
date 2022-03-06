import { utf8ToBase64 } from './FuncUtils'

export interface BasicAuthConfig {
  urlBase: string
  username: string
  password: string
}

export class BasicAuth {
  public static makeAuth(username: string, password: string) {
    const userpwd = `${username}:${password}`
    return `Basic ${utf8ToBase64(userpwd)}`
  }
}
