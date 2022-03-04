import GenerateOtp from "../../helpers/auth/GenerateOtp"
import ErrorResponse from "../../managers/error/ErrorResponse"
import { User } from "../../models/user/User"

const ResendOtpService = async (email: string) => {
  const user = await User.findOne({
    where: {
      email,
    },
    attributes: ["emailVerifiedAt"],
  })

  if (!user) {
    throw new ErrorResponse({
      message: "No user with that email.",
      statusCode: 404,
    })
  }

  if (user.emailVerifiedAt) {
    throw new ErrorResponse({
      message: "User email already verified.",
      statusCode: 403,
    })
  }
}

export default ResendOtpService
