export interface PageOptions {
  _sortKey?: string
  _sortDirection?: string
  _offset?: number
  _length?: number
  [p: string]: any
}

export interface PageResult<T = any> {
  // 偏移量
  offset: number
  // 当前结果数据（items）长度
  length: number
  // 满足请求筛选条件的数据总长度
  totalCount: number
  // 返回数据实体
  items: T[]
}

export interface MultipleTime {
  iso8601: string
  timestamp: number
}

export interface PageFilter {
  _offset?: number
  _length?: number
  _sortKey?: string
  _sortDirection?: string
  ['_updateTs.GT']?: number
  ['_updateTs.GE']?: number
  ['_updateTs.LT']?: number
  ['_updateTs.LE']?: number
  [p: string]: any
}
