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

  const user = await User.findOne({
    where: { id: decoded.text },
    attributes: ["id", "role", "emailVerifiedAt", "email"],
  })

  if (!user) {
    throw new ErrorResponse({
      error: {
        devMessage: "Invalid token, user with that id doesn't exist.",
        possibleSolution: "Please, put the right token.",

        errorCode: 400,
      },
      statusCode: 401,
      message: "Unauthorized access, please contact support.",
    })
  }

  return user
}

export default DecipherToken
