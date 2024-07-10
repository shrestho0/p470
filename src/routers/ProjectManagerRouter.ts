

import express from 'express';
import { ProjectManagerController } from '../controllers/ProjectManagerController';
const projectManagerRouter = express.Router();

const projectManagerController = ProjectManagerController.getInstance();

// Project Manager Routes Here

projectManagerRouter.get('/dashboard', projectManagerController.dashboard)

projectManagerRouter.get('/projects/create', projectManagerController.createProject)

projectManagerRouter.get('/get-members', projectManagerController.getTeamMembers)



export {
    projectManagerRouter
}