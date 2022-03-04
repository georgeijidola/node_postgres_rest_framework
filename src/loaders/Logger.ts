import winston from "winston"

let transports

if ("test".includes(process.env.NODE_ENV!)) {
  transports = new winston.transports.Console()
} else {
  transports = new winston.transports.Console({
    format: winston.format.combine(
      winston.format.cli(),
      winston.format.splat()
    ),
  })
}

const Logger = winston.createLogger({
  level: process.env.LOG_LEVEL!,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports,
})

export default Logger
