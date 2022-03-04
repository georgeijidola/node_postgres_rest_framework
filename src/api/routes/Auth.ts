import { Router } from "express"
import ResendOtpController from "../controllers/auth/ResendOtpController"
import SignInController from "../controllers/auth/SignInController"
import SignUpController from "../controllers/auth/SignUpController"
import VerifyUserEmailController from "../controllers/auth/VerifyUserEmailController"

const router = Router()

router.post("/resend-otp", ResendOtpController)
router.post("/signin", SignInController)
router.post("/signup", SignUpController)
router.post("/verify", VerifyUserEmailController)

export default router
