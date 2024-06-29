import express from "express";
import { AuthController } from "../controllers/AuthController";

const authRouter = express.Router();
const authController = AuthController.getInstance();

// Routes 
authRouter.use('/signin', authController.signin)

authRouter.use('/signup', authController.signup)

authRouter.use('/signout', authController.signout)


// temp
authRouter.get('/redirect', (req, res) => res.render('misc/redirect', {
    message: 'Redirect Page',
    redirectUrl: '/signup'
}))

export { authRouter };

