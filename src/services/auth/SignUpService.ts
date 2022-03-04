import ErrorResponse from "../../managers/error/ErrorResponse"
import { User } from "../../models/user/User"

const SignUpService = async ({
  email,
  password,
}: Pick<User, "email" | "password">) => {
  const user = await User.create({
    email,
    password,
  })

  return user
}

export default SignUpService
