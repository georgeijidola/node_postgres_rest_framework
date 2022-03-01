import expressLoader from "./Express"
import Logger from "./Logger"

const loaders = async () => {
  const app = expressLoader()

  Logger.info("✌️ Express loaded")

  return app
}

export default loaders
