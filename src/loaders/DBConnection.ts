import { Sequelize } from "sequelize"
import config from "../config/Index"

const { name, user, password, host, maxPoolConnections } = config.database

const database = new Sequelize(name, user, password, {
  host,
  dialect: "postgres",
  logging: false,
  pool: {
    max: maxPoolConnections,
    min: 0,
    acquire: 1000,
    idle: 10000,
  },
})

export default database
