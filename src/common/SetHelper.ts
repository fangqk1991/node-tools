export class SetHelper {
  public static getIntersection<T = string>(setA: Set<T>, setB: Set<T>) {
    return new Set([...setA].filter((element) => setB.has(element)))
  }

  public static getUnionSet<T = string>(setA: Set<T>, setB: Set<T>) {
    return new Set([...setA, ...setB])
  }
}
