
import express from 'express';
import { AdminController } from '../controllers/AdminController';
const adminRouter = express.Router();

const adminController = AdminController.getInstance();

// Admin Routes Here

adminRouter.get('/dashboard', adminController.dashboard)


export {
    adminRouter
}