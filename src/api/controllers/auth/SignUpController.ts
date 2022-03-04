import { NextFunction, Request, Response } from "express"
import config from "../../../config/Index"
import { jobQueues } from "../../../enums/JobQueues"
import { RedisNamespaces } from "../../../enums/RedisNamespaces"
import GenerateOtp from "../../../helpers/auth/GenerateOtp"
import SuccessResponse from "../../../helpers/SuccessResponse"
import PushToQueue from "../../../managers/queue/PushToQueue"
import { User } from "../../../models/user/User"
import SignUpService from "../../../services/auth/SignUpService"
import asyncHandler from "../../middlewares/Async"
import redisHandler from "../../../managers/redis/Index"

const SignUpController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { email, password }: Pick<User, "email" | "password"> = req.body

    await SignUpService({
      email,
      password,
    })

    const otp = GenerateOtp()

    const redis = await redisHandler()

    await Promise.allSettled([
      redis.set({
        key: RedisNamespaces.AUTH_OTP + email,
        value: otp,
        EX: 10 * 60,
      }),
      PushToQueue({
        queue: jobQueues.EMAIL,
        data: {
          to: email,
          subject: "Email Verification",
          message: `Please click this <strong><a href='${config.client.url}email/verify/${email}/${otp}'>link</a></strong> to verify your account.`,
        },
      }),
    ])

    await redis.quit()

    return res.status(201).json(
      new SuccessResponse({
        message: "User registered, please check your email to verify account.",
      })
    )
  }
)

export default SignUpController
