import { RedisNamespaces } from "../../enums/RedisNamespaces"
import ErrorResponse from "../../managers/error/ErrorResponse"
import redisHandler from "../../managers/redis/Index"
import { User } from "../../models/user/User"

const VerifyUserEmailService = async ({
  otp,
  email,
}: {
  otp: string
  email: string
}) => {
  const redis = await redisHandler()

  const foundOtp = await redis.get(RedisNamespaces.AUTH_OTP + email)

  if (!foundOtp) {
    const user = await User.findOne({
      where: {
        email,
      },
      attributes: ["emailVerifiedAt"],
    })

    if (user) {
      if (user.emailVerifiedAt) {
        throw new ErrorResponse({
          message: "User already verified",
          statusCode: 403,
        })
      }

      throw new ErrorResponse({
        message: "Invalid otp",
        statusCode: 400,
      })
    }

    throw new ErrorResponse({
      message: "User with that email not found.",
      statusCode: 404,
    })
  }

  if (foundOtp === otp) {
    await Promise.all([
      User.update(
        { emailVerifiedAt: new Date() },
        {
          where: {
            email,
          },
        }
      ),
      redis.del(RedisNamespaces.AUTH_OTP + email),
    ])

    await redis.quit()
  } else {
    throw new ErrorResponse({
      message: "Invalid otp",
      statusCode: 400,
    })
  }
}

export default VerifyUserEmailService
