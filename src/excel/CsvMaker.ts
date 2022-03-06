const processRow = (rowData: any[]) => {
  let finalVal = ''
  for (let j = 0; j < rowData.length; ++j) {
    let innerValue = (rowData[j] || '').toString()
    if (rowData[j] instanceof Date) {
      innerValue = rowData[j].toLocaleString()
    }
    let result = innerValue.replace(/"/g, '""')
    if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"'
    if (j > 0) finalVal += ','
    finalVal += result
  }
  return finalVal
}

export class CsvMaker {
  public columnKeys: string[] = []
  public dataList: any[] = []

  constructor() {}

  public setColumns(columnKeys: string[]) {
    this.columnKeys = columnKeys
    return this
  }

  public pushData(data: any) {
    this.dataList.push(data)
    return this
  }

  public setDataList(dataList: any[]) {
    this.dataList = dataList
    return this
  }

  public makeContent() {
    return this.dataList
      .map((data) => {
        const rowData = this.columnKeys.map((columnKey) => {
          return data[columnKey]
        })
        return processRow(rowData)
      })
      .join('\n')
  }
}
