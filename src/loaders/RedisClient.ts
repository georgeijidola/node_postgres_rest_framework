import { createClient } from "redis"
import config from "../config/Index"
import Logger from "./Logger"

const { user, port, password, host } = config.redis

const redisClient = async () => {
  const client = createClient({
    url: `redis://${host}:${port}`,
    password,
  })

  const defaultEvents = ["connect", "ready", "end", "reconnecting"]

  defaultEvents.forEach((redisEvent) => {
    client.on(redisEvent, () => {
      Logger.info(`Redis client event: ${redisEvent}.`)
    })
  })

  client.on("error", (error) => {
    Logger.error(`Redis client error: ${error}`)
    //   TODO: On error track and send email.
  })

  await client.connect()

  return client
}

export default redisClient
