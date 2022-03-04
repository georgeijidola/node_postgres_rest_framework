import { NextFunction, Request, Response } from "express"
import { RedisNamespaces } from "../../../enums/RedisNamespaces"
import ErrorResponse from "../../../managers/error/ErrorResponse"
import DecipherToken from "../../../helpers/auth/DecipherToken"
import redisHandler from "../../../managers/redis/Index"
import { User } from "../../../models/user/User"
import asyncHandler from "../Async"

// Protect routes
const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const [userId, token] = await DecipherToken(req.headers.authorization)

    const redis = await redisHandler()

    let user = (await redis.JSONGet(RedisNamespaces.AUTH_TOKEN + token)) as any

    if (!user) {
      user = await User.findOne({
        where: { id: userId },
        attributes: ["id", "role"],
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
    }

    req.user = user

    await redis.quit()

    next()
  }
)

export default protect
