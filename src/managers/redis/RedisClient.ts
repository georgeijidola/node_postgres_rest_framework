import { createClient } from "redis"
import config from "../../config/Index"
import Logger from "../../loaders/Logger"

const { port, password, host } = config.redis

const redisClient = async () => {
  const client = createClient({
    url: `redis://${host}:${port}`,
    // password,
  })

  client.on("error", (error) => {
    Logger.error(`Redis client error: ${error}`)
  })

  await client.connect()

  return client
}

export default redisClient
