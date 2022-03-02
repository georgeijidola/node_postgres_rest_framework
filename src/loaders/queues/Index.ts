import Logger from "../Logger"
import connectRabbitMQ from "../../managers/queue/ConnectRabbitMQ"
import initializeQueues from "./InitializeQueues"
import processQueues from "./ProcessQueues"

const queues = async () => {
  try {
    const { channel, connection } = await connectRabbitMQ()

    Logger.info("RabbitMQ connected.")

    await initializeQueues(channel)

    await processQueues(connection)
  } catch (error) {
    Logger.error(error)
  }
}

export default queues
