import Redis from 'ioredis'
import { RedisConfig } from './RedisConfig'

export class RedisCache {
  public prefixKey = 'cache'
  public readonly redis: Redis.Redis

  constructor(config: RedisConfig) {
    this.redis = config.useCluster
      ? (new Redis.Cluster([
          {
            host: config.host,
            port: config.port,
          },
        ]) as any)
      : new Redis(config.port, config.host)
  }

  public makeKey(key: string) {
    return `${this.prefixKey}:${key}`
  }

  /**
   * @param rawKey
   * @param str
   * @param ttl - 单位: 秒
   */
  public async cache(rawKey: string, str: string | number, ttl: number | null = null) {
    const redis = this.redis
    const key = this.makeKey(rawKey)
    const pipeline = redis.pipeline()
    pipeline.set(key, str)
    if (ttl !== null) {
      pipeline.expire(key, ttl)
    }
    await pipeline.exec()
  }

  public async ttl(rawKey: string) {
    return this.redis.ttl(this.makeKey(rawKey))
  }

  public async get(rawKey: string) {
    return this.redis.get(this.makeKey(rawKey))
  }

  public async incrWithTTL(rawKey: string, ttl: number) {
    const key = this.makeKey(rawKey)
    const pipeline = this.redis.pipeline()
    pipeline.incr(key).expire(key, ttl)
    const result = await pipeline.exec()
    return result[0][1] as number
  }

  public async expire(rawKey: string, ttl: number) {
    return this.redis.expire(this.makeKey(rawKey), ttl)
  }

  public async exists(rawKey: string) {
    return this.redis.exists(this.makeKey(rawKey))
  }

  public async hGet(rawKey: string, subKey: string) {
    return this.redis.hget(this.makeKey(rawKey), subKey)
  }

  public async cacheJSON(rawKey: string, data: object, ttl: number | null = null) {
    if (!data || typeof data !== 'object') {
      return
    }
    const redis = this.redis
    const key = this.makeKey(rawKey)
    const pipeline = redis.pipeline()
    pipeline.hmset(key, data)
    if (ttl !== null) {
      pipeline.expire(key, ttl)
    }
    await pipeline.exec()
  }

  public async getJSON(rawKey: string) {
    return this.redis.hgetall(this.makeKey(rawKey))
  }

  public async clear(rawKey: string) {
    return !!(await this.redis.del(this.makeKey(rawKey)))
  }
}
