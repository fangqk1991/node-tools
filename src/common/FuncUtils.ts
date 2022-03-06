import * as crypto from 'crypto'
const uuid = require('uuid/v4')

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function utf8ToBase64(content: string) {
  return Buffer.from(content).toString('base64')
}

export function base64ToUtf8(content: string) {
  return Buffer.from(content, 'base64').toString('utf8')
}

export function md5(content: string | Buffer) {
  return crypto.createHash('md5').update(content).digest('hex')
}

export function hmacSha256Hex(secret: string, content: string | Buffer) {
  return crypto.createHmac('sha256', secret).update(content).digest('hex')
}

export function ucfirst(str: string) {
  str += ''
  return str.charAt(0).toUpperCase() + str.substr(1)
}

export function lcfirst(str: string) {
  str += ''
  return str.charAt(0).toLowerCase() + str.substr(1)
}

export function bigCamel(str: string) {
  const arr = str.split('_')
  return arr.map((item) => ucfirst(item)).join('')
}

export function smallCamel(str: string) {
  return lcfirst(bigCamel(str))
}

export function addSlashes(str: string) {
  return `${str}`.replace(/[\\"']/g, '\\$&')
}

export function getStrEllipsis(str: string, maxLength = 50) {
  if (str.length > maxLength) {
    return `${str.substring(0, maxLength)}...`
  }
  return str
}

export function encodeHtmlStr(htmlStr: string): string {
  const map: any = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  }
  return htmlStr.replace(/[&<>'"]/g, (tag) => {
    return map[tag] || ''
  })
}

export function makeRandomStr(length: number) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function makeRandomDigital(length: number) {
  return Math.random()
    .toString()
    .slice(0 - length)
}

/**
 * 去除 - 字符的 UUID V4
 */
export function makeUUID() {
  return uuid().replace(/-/g, '') as string
}

export function bitArray2Integer(bits: number[]) {
  let value = 0
  for (const bit of bits) {
    value += 1 << bit
  }
  return value
}

export function integer2BitArray(value: number) {
  const bits: number[] = []
  for (let i = 0; 1 << i <= value; ++i) {
    if (value & (1 << i)) {
      bits.push(i)
    }
  }
  return bits
}
