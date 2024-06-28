import express from "express";
import { BaseController } from "../controllers/BaseController";

const baseRouter = express.Router();
const baseController = BaseController.getInstance();

// Routes 
baseRouter.get('', baseController.index)
baseRouter.use('/signin', baseController.signin)

baseRouter.use('/signup', baseController.signup)


// temp
baseRouter.get('/redirect', (req, res) => res.render('misc/redirect', {
    message: 'Redirect Page',
    redirectUrl: '/signup'
}))

export { baseRouter };

