import express from "express";
import { BaseController } from "../controllers/BaseController";
import { authRouter } from "./AuthRouter";
import { protectedRoleRouter } from "./ProtectedRoleRouter";

const baseRouter = express.Router();
const baseController = BaseController.getInstance();

// Routes 
baseRouter.get('/', baseController.index)
baseRouter.get('/dashboard', baseController.dashboard)

baseRouter.use('', authRouter)
baseRouter.use('', protectedRoleRouter)


export { baseRouter };

