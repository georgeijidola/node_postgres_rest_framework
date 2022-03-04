import { NextFunction, Request, Response } from "express"
import { RedisNamespaces } from "../../../enums/RedisNamespaces"
import signToken from "../../../helpers/SignToken"
import SuccessResponse from "../../../helpers/SuccessResponse"
import redisHandler from "../../../managers/redis/Index"
import SignInService from "../../../services/auth/SignInService"
import asyncHandler from "../../middlewares/Async"

const SignInController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { email, password } = req.body

    const user = await SignInService({ email, password })

    const token: string = signToken(user.id)

    const redis = await redisHandler()

    await redis.JSONSet({
      key: RedisNamespaces.AUTH_TOKEN + token,
      value: {
        id: user.id,
        role: user.role,
      },
    })

    await redis.quit()

    return res.status(200).json(new SuccessResponse({ data: user, token }))
  }
)

export default SignInController
