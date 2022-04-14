import { Descriptor, I18nLanguage } from '../src'
import * as assert from 'assert'

describe('Test Descriptor.test.ts', () => {
  it(`Test: describe`, async () => {
    const descriptor = new Descriptor(['V1', 'V2'], (code: string) => {
      switch (code) {
        case 'V1':
          return '[i18n] V1'
        case 'V2':
          return '[i18n] V2'
      }
    })
    descriptor.setI18nData({
      '[i18n] V1': {
        en: 'V1 EN',
        zh: 'V1 ZH',
      },
      '[i18n] V2': {
        en: 'V2 EN',
        zh: 'V2 ZH',
      },
    })
    Descriptor.globalLanguage = () => I18nLanguage.zh
    assert.strictEqual(descriptor.describe('V1'), 'V1 ZH')
    assert.strictEqual(descriptor.describe('V2', I18nLanguage.en), 'V2 EN')
    descriptor.defaultLanguage = I18nLanguage.en
    assert.strictEqual(descriptor.describe('V1'), 'V1 EN')
    assert.strictEqual(descriptor.describe('V2', I18nLanguage.zh), 'V2 ZH')
  })
})
