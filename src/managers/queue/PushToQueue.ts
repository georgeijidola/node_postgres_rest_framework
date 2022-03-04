import Logger from "../../loaders/Logger"
import connectRabbitMQ from "./ConnectRabbitMQ"

const PushToQueue = async ({
  queue,
  data,
}: {
  queue: string
  data: object
}) => {
  try {
    const { channel } = await connectRabbitMQ()

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
      persistent: true,
    })

    await channel.close()
  } catch (error) {
    Logger.error(error)
  }
}

export default PushToQueue
