import config from "../../config/Index"
import jwt from "jsonwebtoken"
import { User } from "../../models/user/User"
import ErrorResponse from "../../managers/error/ErrorResponse"

const DecipherToken = async (token?: string) => {
  // Make sure token exists
  if (token && token.startsWith("Bearer")) {
    token = token.split(" ")[1]
  } else {
    throw new ErrorResponse({
      error: {
        devMessage: "Bearer token is missing.",
        possibleSolution: "Please add bearer token.",
        errorCode: 404,
      },
      message: "Unauthorized access.",
      statusCode: 401,
    })
  }

  const decoded = jwt.verify(token!, config.jwt.secret) as {
    text: string
  }

  return [decoded.text, token]
}

export default DecipherToken
