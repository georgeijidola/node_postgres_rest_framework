import { Router } from "express"
import GetLoggedInUserController from "../controllers/user/GetLoggedInUserController"
import protect from "../middlewares/auth/Protect"

const router = Router()

router.use(protect)

router.get("/", GetLoggedInUserController)

export default router
