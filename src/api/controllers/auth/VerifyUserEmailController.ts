import { NextFunction, Request, Response } from "express"
import { jobQueues } from "../../../enums/JobQueues"
import SuccessResponse from "../../../helpers/SuccessResponse"
import PushToQueue from "../../../managers/queue/PushToQueue"
import VerifyAccountService from "../../../services/auth/VerifyUserEmailService"
import asyncHandler from "../../middlewares/Async"

const VerifyUserEmailController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body

    await VerifyAccountService({ email, otp })

    await PushToQueue({
      queue: jobQueues.EMAIL,
      data: {
        to: email,
        subject: "Email verified",
        message:
          "Congratulations! Your email has been verified, you can now login.",
      },
    })

    return res.status(200).json(
      new SuccessResponse({
        message: "User email verified.",
      })
    )
  }
)

export default VerifyUserEmailController
