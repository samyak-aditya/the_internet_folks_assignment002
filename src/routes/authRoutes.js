import express from 'express';
import { signUp, signIn, getMe, } from '../controllers/authController.js';

import { checkAuth } from '../middleware/authMiddleware.js';

const authRouter = express.Router();

authRouter.post('/signup', signUp);
authRouter.post('/signin', signIn);
authRouter.get('/me',checkAuth, getMe);



export default authRouter;
