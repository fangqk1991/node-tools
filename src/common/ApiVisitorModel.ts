export interface ApiVisitorModel {
  // 用户 ID，具备唯一性
  member: string
  // 应用密钥
  secret: string
  // 临时密钥
  secretTmp: string
  // 用户名
  name: string
  // 是否可用
  isEnabled: boolean
  // 安全模式，安全模式下会进行 IP 校验
  secureMode: boolean
  // '绑定的 IP 列表，以 ; 分隔'
  bindAddress: string
  // 备注信息
  remarks: string
  // 创建时间: ISO8601 字符串
  createTime: string
  // 更新时间: ISO8601 字符串
  updateTime: string
}

export interface ApiVisitorV2 {
  // 用户 ID，具备唯一性
  appid: string
  // 应用密钥
  secrets: string[]
  // 用户名
  name: string
  // 是否可用
  isEnabled: boolean
  // 安全模式，安全模式下会进行 IP 校验
  secureMode: boolean
  // '绑定的 IP 列表，以 ; 分隔'
  bindAddress: string
}
