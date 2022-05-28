export class TemplateHelper {
  public static renderTmpl(tmpl: string, data: { [p: string]: any }, renderUndefinedProps = true) {
    return (tmpl || '').replace(/\{\{\.(.*?)\}\}/g, (_: any, dataKey: string) => {
      return dataKey in data ? data[dataKey] : renderUndefinedProps ? '' : `{{.${dataKey}}}`
    })
  }

  public static extractVariables(tmpl: string) {
    const items: string[] = []
    const matches = (tmpl || '').match(/\{\{\.(.*?)\}\}/g)
    if (matches) {
      items.push(...matches)
    }
    const keys = items.map((item) => item.match(/\{\{\.(.*?)\}\}/)![1])
    return [...new Set(keys)]
  }

  public static renderRetainedVariables(tmpl: string, data: { [p: string]: any }, renderUndefinedProps = true) {
    return (tmpl || '').replace(/\{\{(__.*?__)\}\}/g, (_: any, dataKey: string) => {
      return dataKey in data ? data[dataKey] : renderUndefinedProps ? '' : `{{${dataKey}}}`
    })
  }

  public static extractRetainedVariables(tmpl: string) {
    const items: string[] = []
    const matches = (tmpl || '').match(/\{\{(__.*?__)\}\}/g)
    if (matches) {
      items.push(...matches)
    }
    const keys = items.map((item) => item.match(/\{\{(__.*?__)\}\}/)![1])
    return [...new Set(keys)]
  }
}
