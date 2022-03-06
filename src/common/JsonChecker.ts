export class JsonChecker {
  public static checkJSON(content: string) {
    try {
      const obj = JSON.parse(content)
      return !!obj && typeof obj === 'object'
    } catch (e) {}
    return false
  }
}
