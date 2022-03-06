export enum DiffType {
  Created = 'Created',
  Updated = 'Updated',
  Deleted = 'Deleted',
  Unchanged = 'Unchanged',
}

export interface DiffEntity {
  keychain: string[]
  type: DiffType
  from: any
  to: any
}

const isFunction = function (x: any) {
  return Object.prototype.toString.call(x) === '[object Function]'
}

const isArray = function (x: any) {
  return Object.prototype.toString.call(x) === '[object Array]'
}

const isDate = function (x: any) {
  return Object.prototype.toString.call(x) === '[object Date]'
}

const isRegex = function (x: any) {
  return Object.prototype.toString.call(x) === '[object RegExp]'
}

const isObject = function (x: any) {
  return Object.prototype.toString.call(x) === '[object Object]'
}

const isValue = function (x: any) {
  return !isObject(x) && !isArray(x)
}

const compareValues = function (value1: any, value2: any) {
  if (value1 === value2) {
    return DiffType.Unchanged
  }
  if (isDate(value1) && isDate(value2) && value1.getTime() === value2.getTime()) {
    return DiffType.Unchanged
  }
  if (value1 === undefined) {
    return DiffType.Created
  }
  if (value2 === undefined) {
    return DiffType.Deleted
  }
  return DiffType.Updated
}

const checkLeafNode = (node: any) => {
  return isObject(node) && Object.keys(node).length === 3 && 'type' in node && 'from' in node && 'to' in node
}

const deepCopy = (object: any) => {
  const func = (obj: any, cur: any) => {
    for (const key in obj) {
      if (isArray(obj[key])) {
        cur[key] = []
        func(obj[key], cur[key])
      } else if (isObject(obj[key])) {
        cur[key] = {}
        func(obj[key], cur[key])
      } else {
        cur[key] = obj[key]
      }
    }
  }
  const result = Array.isArray(object) ? [] : {}
  func(object, result)
  return result
}

const getObjectChainForData = (data: any, keychain: (string | number)[]) => {
  const chain = [data]
  for (const key of keychain) {
    if (typeof data === 'object' && key in data) {
      data = data[key]
      chain.push(data)
      continue
    }
    return [] as any[]
  }
  return chain as any[]
}

const endItem = (items: any[]) => {
  return items[items.length - 1]
}

export class DiffMapper {
  private readonly fromObj: {}
  private readonly toObj: {}
  private readonly rawSpecialKeychains: any[][]

  public constructor(fromObj: {}, toObj: {}) {
    this.fromObj = fromObj
    this.toObj = toObj
    this.rawSpecialKeychains = []
  }

  public addSpecialKeychain(keychain: any[]) {
    this.rawSpecialKeychains.push(keychain)
  }

  private _compare(obj1: any, obj2: any) {
    if (isFunction(obj1) || isFunction(obj2)) {
      throw 'Invalid argument. Function given, object expected.'
    }
    if (isValue(obj1) || isValue(obj2)) {
      return {
        type: compareValues(obj1, obj2),
        from: obj1,
        to: obj2,
      }
    }

    let diff: any = {}
    for (let key in obj1) {
      if (isFunction(obj1[key])) {
        continue
      }

      let value2 = undefined
      if (obj2[key] !== undefined) {
        value2 = obj2[key]
      }

      diff[key] = this._compare(obj1[key], value2)
    }
    for (let key in obj2) {
      if (isFunction(obj2[key]) || diff[key] !== undefined) {
        continue
      }

      diff[key] = this._compare(undefined, obj2[key])
    }

    return diff
  }

  private _trimCompareMap(compareMap: any) {
    compareMap = deepCopy(compareMap)
    const trimNodes = (node: any) => {
      if (checkLeafNode(node)) {
        return node['type'] !== DiffType.Unchanged
      }
      for (const key in node) {
        if (!trimNodes(node[key])) {
          delete node[key]
        }
      }
      return Object.keys(node).length > 0
    }

    trimNodes(compareMap)
    return compareMap
  }

  public buildDiffMap() {
    const result = this.buildCompareMap()
    return this._trimCompareMap(result)
  }

  private _buildSpecialKeychains(targetMap: any) {
    const result: any[][] = []
    for (const rawKeychain of this.rawSpecialKeychains) {
      let curItems: any[][] = [[]]
      for (const curKey of rawKeychain) {
        const nextItems = []
        for (const curKeychain of curItems) {
          let targetData = endItem(getObjectChainForData(targetMap, curKeychain))
          if (!targetData) {
            break
          }
          const keys = isRegex(curKey) ? Object.keys(targetData) : [curKey]
          for (const key of keys) {
            if (!checkLeafNode(targetData[key])) {
              nextItems.push([...curKeychain, key])
            }
          }
        }
        curItems = nextItems
      }
      result.push(...curItems)
    }
    return result
  }

  public buildCompareMap() {
    const compareMap = this._compare(this.fromObj, this.toObj)
    const specialKeychains = this._buildSpecialKeychains(compareMap)
    if (specialKeychains.length > 0) {
      const diffMap = this._trimCompareMap(compareMap)
      for (const keychain of specialKeychains) {
        const compareChain = getObjectChainForData(compareMap, keychain)
        const diffChain = getObjectChainForData(diffMap, keychain)
        const fromObjChain = getObjectChainForData(this.fromObj, keychain)
        const toObjChain = getObjectChainForData(this.toObj, keychain)

        if (compareChain.length === 0) {
          continue
        }

        let diffType = DiffType.Unchanged
        if (fromObjChain.length === 0 && toObjChain.length === 0) {
          continue
        } else if (fromObjChain.length > 0 && toObjChain.length === 0) {
          diffType = DiffType.Deleted
        } else if (fromObjChain.length === 0 && toObjChain.length > 0) {
          diffType = DiffType.Created
        } else if (fromObjChain.length > 0 && toObjChain.length > 0) {
          diffType = diffChain.length > 0 ? DiffType.Updated : DiffType.Unchanged
        }

        const fromObj = fromObjChain.length > 0 ? endItem(fromObjChain) : undefined
        const toObj = toObjChain.length > 0 ? endItem(toObjChain) : undefined

        if (compareChain.length === 1) {
          return {
            type: diffType,
            from: fromObj,
            to: toObj,
          }
        } else {
          const keyParent = compareChain[compareChain.length - 2]
          const lastKey = endItem(keychain)
          keyParent[lastKey] = {
            type: diffType,
            from: fromObj,
            to: toObj,
          }
        }
      }
    }

    return compareMap
  }

  public buildCompareItems() {
    const data = this.buildCompareMap()

    const leaves: DiffEntity[] = []
    let curItems: { keychain: string[]; node: any }[] = [
      {
        keychain: [],
        node: data,
      },
    ]
    while (curItems.length > 0) {
      const newItems: any[] = []
      curItems.forEach((item) => {
        const node = item.node
        if (checkLeafNode(node)) {
          leaves.push({
            keychain: item.keychain,
            type: node.type,
            from: node.from,
            to: node.to,
          })
          return
        }

        Object.keys(node).forEach((key) => {
          newItems.push({
            keychain: [...item.keychain, key],
            node: node[key],
          })
        })
      })
      curItems = newItems
    }

    return leaves
  }

  public buildDiffItems() {
    return this.buildCompareItems().filter((item) => item.type !== DiffType.Unchanged)
  }

  public checkNoChanges() {
    return this.buildDiffItems().length === 0
  }

  public static compare(fromObj: {}, toObj: {}) {
    return new this(fromObj, toObj).buildCompareItems()
  }

  public static diff(fromObj: {}, toObj: {}) {
    return new this(fromObj, toObj).buildDiffItems()
  }

  public static checkEquals(fromObj: {}, toObj: {}) {
    return new this(fromObj, toObj).checkNoChanges()
  }
}
