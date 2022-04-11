import { I18nCode } from '../constants'

export interface SimpleVisitor {
  email: string
}

export interface VisitorInfo extends SimpleVisitor {
  iamId: number
  email: string
  name: string
  permissionKeyMap: { [p: string]: 1 }
  locale: I18nCode
  isAdmin?: boolean
}

export interface PreferenceInfo {
  locale: I18nCode
}
