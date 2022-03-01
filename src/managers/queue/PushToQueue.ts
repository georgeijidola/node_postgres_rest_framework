import connectRabbitMQ from "./ConnectRabbitMQ"

const PushToQueue = async ({
  queue,
  data,
}: {
  queue: string
  data: object
}) => {
  const { channel } = await connectRabbitMQ()

  channel.sendToQueue(queue, Buffer.from(data.toString()), { persistent: true })

  await channel.close()
}

export default PushToQueue
