import Password from "../../helpers/Password"
import ErrorResponse from "../../managers/error/ErrorResponse"
import { User } from "../../models/user/User"

interface signInParameters {
  email: string
  password: string
}

const SignInService = async ({ email, password }: signInParameters) => {
  // Validate email and password
  if (!email || email === "") {
    throw new ErrorResponse({
      message: "Please provide an email.",
      statusCode: 400,
    })
  }

  if (!password || password === "") {
    throw new ErrorResponse({
      message: "Please provide a password.",
      statusCode: 400,
    })
  }

  let user = await User.findOne({
    where: { email },
    attributes: ["id", "role", "password", "email", "emailVerifiedAt"],
  })

  if (!user) {
    throw new ErrorResponse({
      message: "Email doesn't exist.",
      statusCode: 404,
    })
  }

  const passwordsMatch = Password.compare(user.password!, password)

  if (!passwordsMatch) {
    throw new ErrorResponse({
      message: "Email or password is incorrect.",
      statusCode: 400,
    })
  }

  if (!user.emailVerifiedAt) {
    throw new ErrorResponse({
      message: "Email not verified, please contact support.",
      statusCode: 403,
    })
  }

  return {
    id: user.id,
    role: user.role,
    email: user.email,
    emailVerifiedAt: user.emailVerifiedAt,
  }
}

export default SignInService
