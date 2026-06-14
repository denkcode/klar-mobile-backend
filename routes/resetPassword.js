import { Router } from "express";
import { celebrate } from 'celebrate';
import { requestResetEmailSchema, resetPasswordSchema } from "../validations/authValidation.js";
import { requestResetEmail, resetPassword } from "../controllers/authContcoller.js";

const router = Router()
router.post('/request-reset-email', celebrate(requestResetEmailSchema), requestResetEmail)
router.post('/reset-password', celebrate(resetPasswordSchema), resetPassword)
export default router