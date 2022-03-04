import redisClient from "./RedisClient"

const redisHandler = async () => {
  const redis = await redisClient()
  const expiry = 72 * 60 * 60

  return {
    JSONGet: async (key: string) => await redis.json.get(key),
    JSONSet: async ({
      key,
      path = ".",
      value,
      EX = expiry,
    }: {
      key: string
      path?: string
      value: {}
      EX?: number
    }) => {
      const [obj] = await redis
        .multi()
        .json.set(key, path, value, {
          NX: true,
        })
        .expire(key, EX)
        .exec()

      return obj
    },
    hSet: async ({
      hash,
      key,
      value,
      EX = expiry,
    }: {
      hash: string
      key: string
      value: string
      EX?: number
    }) => {
      const [obj] = await redis
        .multi()
        .hSet(hash, key, value)
        .expire(key, EX)
        .exec()

      return obj
    },
    hGetAll: async (key: string) => await redis.hGetAll(key),
    hDel: async ({ hash, key }: { hash: string; key: string }) =>
      await redis.hDel(hash, key),
    hGet: async ({ hash, key }: { hash: string; key: string }) =>
      await redis.hGet(hash, key),
    set: async ({
      key,
      value,
      EX = expiry,
    }: {
      key: string
      value: string
      EX?: number
    }) =>
      await redis.set(key, value, {
        EX,
      }),
    get: async (key: string) => await redis.get(key),
    del: async (key: string) => await redis.del(key),
    quit: async () => await redis.quit(),
  }
}

export default redisHandler
