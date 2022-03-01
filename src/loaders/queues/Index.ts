import Logger from "../Logger"
import connectRabbitMQ from "../../managers/queue/ConnectRabbitMQ"
import initializeQueues from "./InitializeQueues"
import processQueues from "./ProcessQueues"

const queues = async () => {
  const { channel, connection } = await connectRabbitMQ()

  Logger.info("RabbitMQ connected.")

  await initializeQueues(channel)

  await processQueues(connection)
}

export default queues
