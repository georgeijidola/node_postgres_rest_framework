import Logger from "../../loaders/Logger"
import ErrorResponse from "./ErrorResponse"

const errorHandler = (error: any): ErrorResponse => {
  let message: string | any[]

  if (process.env.NODE_ENV!.includes("development")) {
    // Log to console for dev
    Logger.error(`Error ===>>> ${error}`)
    console.error("Error body => ", error)
  }

  if (error.name === "SyntaxError" && error.type === "entity.parse.failed") {
    return new ErrorResponse({
      error: {
        devMessage: "Bad input format.",
        possibleSolution: "",
        errorCode: 400,
      },
      message: "Something went wrong, please contact support.",
      statusCode: 403,
    })
  }

  switch (error.name) {
    case "URIError":
    case "EvalError":
    case "ReferenceError":
    case "RangeError":
    case "TypeError":
      return new ErrorResponse({})

      break

    case "JsonWebTokenError":
      return new ErrorResponse({
        message: "Not authorized to access this route",
        statusCode: 401,
      })

      break

    // Sequelize Errors
    case "SequelizeValidationError":
      const err = error.errors[0]
      let message = err.message

      if (err.type.includes("notNull")) {
        const path = err.path.charAt(0).toUpperCase() + err.path.slice(1)
        message = `${path} is required.`
      }

      return new ErrorResponse({
        message,
        statusCode: 400,
      })

      break

    case "SequelizeUniqueConstraintError":
      const path = error.errors[0].path

      return new ErrorResponse({
        message: `${
          path.charAt(0).toUpperCase() + path.slice(1)
        } already exists.`,
        statusCode: 400,
      })

      break

    // Token expiration
    case "TokenExpiredError":
      return new ErrorResponse({
        message: "Session expired, please log in again.",
        statusCode: 401,
      })

      break
  }

  return error
}

export default errorHandler
