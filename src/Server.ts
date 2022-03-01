import config from "./config/Index"
import Logger from "./loaders/Logger"
import loaders from "./loaders/Index"

const startServer = async () => {
  const app = await loaders()

  app
    .listen(config.port, () => {
      Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `)
    })
    .on("error", (err: Error) => {
      Logger.error(err)
    })
}

startServer()

// Handle unhandled promise rejections
process.on("unhandledRejection", (error: Error) => {
  Logger.error(error)

  // TODO: Send mail to first responder
})

// Handle unhandled promise rejections
process.on("uncaughtException", (error: Error) => {
  Logger.error(error)

  // TODO: Send mail to first responder
})
