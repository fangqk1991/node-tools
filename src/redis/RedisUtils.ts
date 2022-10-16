import Redis from 'ioredis'
import { RedisConfig } from './RedisConfig'

export class RedisUtils {
  public static prepareRedis(config: RedisConfig) {
    return new Redis(config)
  }
}
