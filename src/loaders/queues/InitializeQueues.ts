import { jobQueues } from "../../enums/JobQueues"
import Logger from "../Logger"
import { Channel } from "amqplib"

const initializeQueues = async (channel: Channel) => {
  try {
    const jobs = [jobQueues.EMAIL]

    jobs.forEach((job) => {
      channel.assertQueue(job, {
        durable: true,
      })
    })

    Logger.info("Job queues created successfully.")
  } catch (error) {
    Logger.error(error)
  }
}

export default initializeQueues
