import { Request, Response } from "express"
import config from "../../../config/Index"
import { jobQueues } from "../../../enums/JobQueues"
import { RedisNamespaces } from "../../../enums/RedisNamespaces"
import GenerateOtp from "../../../helpers/auth/GenerateOtp"
import SuccessResponse from "../../../helpers/SuccessResponse"
import { SendMail } from "../../../managers/email/SendMail"
import PushToQueue from "../../../managers/queue/PushToQueue"
import redisHandler from "../../../managers/redis/Index"
import ResendOtpService from "../../../services/auth/ResendOtpService"
import asyncHandler from "../../middlewares/Async"

const ResendOtpController = asyncHandler(
  async (req: Request, res: Response) => {
    const email = req.body.email

    await ResendOtpService(email)

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
          message: `Please click this <strong><a href='${config.client.url}email/verify/${req.body.email}/${otp}'>link</a></strong> to verify your account.`,
        },
      }),
    ])

    await redis.quit()

    res.status(200).json(new SuccessResponse({ message: "OTP resent." }))
  }
)

export default ResendOtpController
