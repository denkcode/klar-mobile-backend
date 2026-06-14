import { celebrate } from 'celebrate';
import { Router } from "express";
import { getMe, LoginUser, logOut, refresh, registerUser } from '../controllers/authContcoller.js';
import { loginUserSchema, registerSchema} from '../validations/authValidation.js'
import { authenticate } from '../middlewares/authenticate.js'
const router = Router();

router.post('/register', celebrate(registerSchema), registerUser)
router.post('/login', celebrate(loginUserSchema), LoginUser)
router.get('/me', authenticate, getMe)
router.post('/logout', authenticate, logOut)
router.post('/refresh', refresh)

export default router