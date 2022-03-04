import { NextFunction, Request, Response } from "express"
import { RedisNamespaces } from "../../../enums/RedisNamespaces"
import SuccessResponse from "../../../helpers/SuccessResponse"
import redisHandler from "../../../managers/redis/Index"
import { User } from "../../../models/user/User"
import GetLoggedInUserService from "../../../services/userManagement/GetLoggedInUserService"
import asyncHandler from "../../middlewares/Async"

const GetLoggedInUserController = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = await GetLoggedInUserService(req.user)

    return res.status(200).json(new SuccessResponse({ data: user }))
  }
)

export default GetLoggedInUserController
