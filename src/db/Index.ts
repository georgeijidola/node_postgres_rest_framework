import { readFileSync } from "fs"
import { SequelizeStorage, Umzug } from "umzug"
import database from "../loaders/DBConnection"
import Logger from "../loaders/Logger"

const getRawSqlClient = () => {
  return {
    query: async (sql: string) => database.query(sql),
  }
}

const migrate = async (path: string) => {
  const sql = readFileSync(path).toString()

  return database.query(sql)
}

const migrator = new Umzug({
  migrations: {
    glob: "migrations/*.up.sql",
    resolve: ({ name, path }) => ({
      name,
      up: async () => await migrate(path!),
      down: async () => await migrate(path!.replace(".up.sql", ".down.sql")),
    }),
  },
  context: getRawSqlClient(),
  storage: new SequelizeStorage({
    sequelize: database,
    modelName: "MigrationMeta",
    tableName: "migrations_meta",
  }),
  logger: console,
})

const seeder = new Umzug({
  migrations: {
    glob: "seeds/*.up.sql",
    resolve: ({ name, path }) => ({
      name,
      up: async () => await migrate(path!),
      down: async () => await migrate(path!.replace(".up.sql", ".down.sql")),
    }),
  },
  context: getRawSqlClient(),
  storage: new SequelizeStorage({
    sequelize: database,
    modelName: "SeedMeta",
    tableName: "seeds_meta",
  }),
  logger: console,
})

const resolveCommand = async () => {
  try {
    const thirdArgument = process.argv[2]
    const fourthArgument = process.argv[3]

    if (thirdArgument !== "migrate" && thirdArgument !== "seed") {
      throw new Error(
        "Invalid migration command. Do you mean 'migrate' or 'seed'?"
      )
    }

    if (fourthArgument !== "up" && fourthArgument !== "down") {
      throw new Error(
        `Invalid ${thirdArgument} command. Do you mean 'migrate' or 'seed'?`
      )
    }

    if (thirdArgument === "migrate") {
      fourthArgument === "up"
        ? await migrator.up()
        : await migrator.down({ to: 0 })
    } else if (thirdArgument === "seed") {
      fourthArgument === "up" ? await seeder.up() : await seeder.down({ to: 0 })
    }
  } catch (error) {
    Logger.error(error)
  }
}

export default resolveCommand
