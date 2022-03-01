import { Connection } from "amqplib"
import { jobQueues } from "../../enums/JobQueues"
import { SendMail } from "../../managers/email/SendMail"
import connectRabbitMQ from "../../managers/queue/ConnectRabbitMQ"

const processQueues = async (connection: Connection) => {
  for (const job in jobQueues) {
    const channel = await connection.createChannel()

    channel.prefetch(1)
    channel.consume(
      job,
      async (data) => {
        const payload = data && JSON.parse(data.content.toString())

        if (payload && data) {
          switch (job) {
            case jobQueues.EMAIL:
              await SendMail(payload)
              break
          }

          channel.ack(data)
        }
      },
      { noAck: false }
    )
  }
}

export default processQueues
