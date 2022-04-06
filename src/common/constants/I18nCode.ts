import { Descriptor } from '../Descriptor'

export enum I18nCode {
  en = 'en',
  zhHans = 'zh-Hans',
}

const values = [I18nCode.en, I18nCode.zhHans]

const describe = (code: I18nCode) => {
  switch (code) {
    case I18nCode.en:
      return 'English'
    case I18nCode.zhHans:
      return '简体中文'
  }
}

export interface I18nTextData {
  [I18nCode.en]: string
  [I18nCode.zhHans]: string
}

export const I18nCodeDescriptor = new Descriptor(values, describe)
