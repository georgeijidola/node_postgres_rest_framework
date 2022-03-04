import ErrorResponse from "../../managers/error/ErrorResponse"
import { User } from "../../models/user/User"

const GetLoggedInUserService = async (loggedInUser: User) => {
  const user = await User.findOne({
    where: { id: loggedInUser.id },
    attributes: ["id", "role", "email", "emailVerifiedAt"],
  })

  if (!user) {
    throw new ErrorResponse({
      message: "User doesn't exist.",
      statusCode: 404,
    })
  }

  return user
}

export default GetLoggedInUserService
