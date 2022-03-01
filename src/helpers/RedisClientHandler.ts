import { RedisClientType } from "redis"

class RedisClientHandler {
  client: RedisClientType
  expiry: number = 72 * 60 * 60 * 1000

  constructor(redisClient: RedisClientType) {
    this.client = redisClient
  }

  //   async transactionHandler(promises: Promise<any>[]): Promise<any> {
  //     this.client.multi()

  //     try {
  //       const results = promises.map(async (promise) => await promise)

  //       return results
  //     } catch (error) {
  //       this.client.discard()
  //     } finally {
  //       await this.client.sendCommand(["EXEC"])
  //     }
  //   }

  async jsonGet(key: string) {
    return await this.client.json.get(key)
  }

  async JSONSet({
    key,
    path = ".",
    json,
    EX = this.expiry,
  }: {
    key: string
    path: string
    json: {}
    EX?: number
  }) {
    const [obj] = await this.client
      .multi()
      .json.set(key, path, json, {
        NX: true,
      })
      .expire(key, EX)
      .exec()

    return obj
  }

  async hSet({
    hash,
    key,
    value,
    EX = this.expiry,
  }: {
    hash: string
    key: string
    value: string
    EX?: number
  }) {
    const [obj] = await this.client
      .multi()
      .hSet(hash, key, value)
      .expire(key, EX)
      .exec()

    return obj
  }

  async hGetAll(key: string) {
    return await this.client.hGetAll(key)
  }

  async hDel({ hash, key }: { hash: string; key: string }) {
    return await this.client.hDel(hash, key)
  }

  async hGet({ hash, key }: { hash: string; key: string }) {
    return await this.client.hGet(hash, key)
  }

  async set({
    key,
    value,
    EX = this.expiry,
  }: {
    key: string
    value: string
    EX?: number
  }) {
    return await this.client.set(key, value, {
      EX,
    })
  }

  async del(key: string) {
    return await this.client.del(key)
  }
}

export default RedisClientHandler
