import dotenv from "dotenv"
import errorHandler from "../managers/error/ErrorHandler"

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development"

try {
  dotenv.config()

  // if (envFound.error && "development".includes(process.env.NODE_ENV)) {
  //   // This error should crash whole process

  //   throw new Error("⚠️  Couldn't find config.env file  ⚠️")
  // }

  const keys = [
    // Server
    "PORT",
    "API_KEY",

    // Database
    "DB_HOST",
    "DB_DATABASE",
    "DB_USER",
    "DB_PASSWORD",
    "DB_PORT",
    "DB_MAX_POOL",

    // Redis
    "REDIS_HOST",
    "REDIS_PASSWORD",
    "REDIS_MAXMEMORY",
    "REDIS_MAXMEMORY_POLICY",
    "REDIS_PORT",

    // RabbitMQ
    "RABBITMQ_PORT",
    "RABBITMQ_HOST",
    "RABBITMQ_MANAGEMENT_PORT",
    "RABBITMQ_USER",
    "RABBITMQ_PASS",

    // JWT
    "JWT_SECRET",
    "JWT_SECRET_EXPIRE",

    // Client URL
    "CLIENT",

    // Super Admin
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",

    // Logger
    "LOG_LEVEL",

    // Mail
    "SENDER_EMAIL",
    "SENDER_EMAIL_PASSWORD",

    // Sentry
    "SENTRY_DSN",
    "SENTRY_TRACES_SAMPLE_RATE",
  ]

  let missingKeys: string[] = []

  keys.forEach((key) => {
    !process.env[key] && missingKeys.push(key)
  })

  if (missingKeys.length >= 1) {
    throw new Error(
      `${missingKeys.join(", ")} are missing and must be defined.`
    )
  }
} catch (error) {
  errorHandler(error)

  process.exit(0)
}

const config = {
  /**
   * Super admin details
   */
  superAdmin: {
    email: process.env.SUPER_ADMIN_EMAIL,
    password: process.env.SUPER_ADMIN_PASSWORD,
  },

  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT!, 10),

  /**
   * Postgres
   */
  database: {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    name: process.env.DB_DATABASE!,
    maxPoolConnections: parseInt(process.env.DB_MAX_POOL!),
  },

  /**
   * RabbitMQ
   */
  rabbitmq: {
    port: parseInt(process.env.RABBITMQ_PORT!),
    username: process.env.RABBITMQ_USER!,
    password: process.env.RABBITMQ_PASS!,
    hostname: process.env.RABBITMQ_HOST!,
  },

  /**
   * Redis
   */
  redis: {
    port: process.env.REDIS_PORT!,
    password: process.env.REDIS_PASSWORD!,
    host: process.env.REDIS_HOST!,
  },

  /**
   * JWT secret key and expiration
   */
  jwt: {
    secret: process.env.JWT_SECRET as string,
    secretExpire: process.env.JWT_SECRET_EXPIRE as string,
  },

  /**
   * Client public credentials
   */
  client: {
    url: process.env.CLIENT,
  },

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || "silly",
  },

  /**
   * API configs
   */
  api: {
    prefix: "/api/v1/",
    key: process.env.API_KEY!,
  },

  /**
   * Email sender credentials
   */
  sender: {
    email: process.env.SENDER_EMAIL,
    password: process.env.SENDER_EMAIL_PASSWORD,
  },

  /**
   * Sentry credentials
   */
  sentry: {
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: process.env.SENTRY_TRACES_SAMPLE_RATE,
  },
}

export default config
