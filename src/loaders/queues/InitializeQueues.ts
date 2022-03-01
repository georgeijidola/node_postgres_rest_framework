import { jobQueues } from "../../enums/JobQueues"
import Logger from "../Logger"
import { Channel } from "amqplib"

const initializeQueues = async (channel: Channel) => {
  try {
    for (const job in jobQueues) {
      channel.assertQueue(job, {
        durable: true,
      })
    }

    Logger.info("Job queues created successfully.")
  } catch (error) {
    Logger.error(error)
  }
}

export default initializeQueues
