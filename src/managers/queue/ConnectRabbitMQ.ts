import { connect } from "amqplib"
import config from "../../config/Index"

const { username, hostname, password, port } = config.rabbitmq

const connectRabbitMQ = async () => {
  const connection = await connect({
    username,
    hostname,
    password,
    port,
  })

  const channel = await connection.createChannel()

  return { channel, connection }
}

export default connectRabbitMQ
