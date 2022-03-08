export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface CascadeSelectOption extends SelectOption {
  children?: CascadeSelectOption[]
}

export interface CheckOption extends SelectOption {
  checked: boolean
}

export enum I18nLanguage {
  en = 'en',
  zh = 'zh',
}

export interface I18nItem {
  [I18nLanguage.en]: string
  [I18nLanguage.zh]: string
}

export interface I18nData {
  [p: string]: I18nItem
}

export class Descriptor<T = any> {
  public values: T[]
  private readonly _codeMap: any
  private readonly _nameMap: any
  public i18nData: I18nData = {}
  public defaultLanguage: I18nLanguage = I18nLanguage.en

  constructor(values: T[], describeFunc: Function) {
    this.values = values

    const codeMap = {}
    const nameMap = {}
    for (const code of values) {
      const name = describeFunc(code)
      codeMap[code as any] = name
      nameMap[name] = code
    }
    this._codeMap = codeMap
    this._nameMap = nameMap
  }

  public setI18nData(data: I18nData, defaultLanguage = I18nLanguage.en) {
    this.i18nData = data
    this.defaultLanguage = defaultLanguage
    return this
  }

  public checkValueValid(code: any) {
    return code in this._codeMap
  }

  public value2LabelMap() {
    return this._codeMap
  }

  public describe(code: any, language?: I18nLanguage) {
    const label = this._codeMap[code] || ''
    language = language || this.defaultLanguage
    if (this.i18nData[label] && this.i18nData[label][language]) {
      return this.i18nData[label][language]
    }
    return label
  }

  public decode(name: any) {
    return this._nameMap[name] || ''
  }

  public options() {
    return this.values.map((value) => {
      return {
        label: this.describe(value),
        value: value as any,
      }
    }) as SelectOption[]
  }

  public stringOptions() {
    return this.values.map((value) => {
      return {
        label: this.describe(value),
        value: `${value}`,
      }
    }) as SelectOption[]
  }
}
