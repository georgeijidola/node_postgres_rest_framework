import { Connection } from "amqplib"
import { jobQueues } from "../../enums/JobQueues"
import { SendMail } from "../../managers/email/SendMail"
import Logger from "../Logger"

const processQueues = async (connection: Connection) => {
  try {
    // TODO: Handle this job queues globally
    const jobs = [jobQueues.EMAIL]

    jobs.forEach(async (job) => {
      const channel = await connection.createChannel()

      await channel.prefetch(1)
      await channel.consume(
        job,
        async (data) => {
          if (data) {
            const payload = JSON.parse(data.content.toString())

            await SendMail(payload)

            channel.ack(data)
          }
        },
        { noAck: false }
      )
    })
  } catch (error) {
    Logger.error(error)
  }
}

export default processQueues
