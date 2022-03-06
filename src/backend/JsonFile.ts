import * as fs from 'fs'

export class JsonFile {
  public readonly filePath: string
  private _data?: {} | []

  constructor(filePath: string) {
    this.filePath = filePath
    this.loadData()
  }

  private loadData() {
    try {
      const content = fs.readFileSync(this.filePath, 'utf8')
      this._data = JSON.parse(content)
    } catch (e) {}
  }

  public getData<T>() {
    return this._data as T
  }

  public saveData(data: {} | []) {
    this._data = data
    const content = JSON.stringify(data, null, 2)
    fs.writeFileSync(this.filePath, content)
  }
}
