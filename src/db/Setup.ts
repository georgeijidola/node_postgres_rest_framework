import { Pool } from "pg"
import config from "../config/Index"
import Logger from "../loaders/Logger"

const { name, user, password, host } = config.database

const pool = new Pool({
  host,
  user,
  password,
})

const findDatabase = async (pool: Pool) => {
  return await pool.query(
    `SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = lower('${name}');`
  )
}

const createDatabase = async () => {
  try {
    const result = await findDatabase(pool)

    if (result.rowCount === 0) {
      Logger.info(`Creating database ${name}`)

      await pool.query(`CREATE DATABASE ${name}`)
    } else {
      Logger.info("Database already exists.")
    }

    process.exit(0)
  } catch (error) {
    Logger.error(error)
  }
}

export default createDatabase()
