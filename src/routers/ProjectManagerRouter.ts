

import express from 'express';
import { ProjectManagerController } from '../controllers/ProjectManagerController';
const projectManagerRouter = express.Router();

const projectManagerController = ProjectManagerController.getInstance();

// Project Manager Routes Here

projectManagerRouter.get('/dashboard', projectManagerController.dashboard)


export {
    projectManagerRouter
}