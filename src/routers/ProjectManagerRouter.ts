

import express from 'express';
import { ProjectManagerController } from '../controllers/ProjectManagerController';
const projectManagerRouter = express.Router();

const projectManagerController = ProjectManagerController.getInstance();

// Project Manager Routes Here

projectManagerRouter.get('/dashboard', projectManagerController.dashboard)

projectManagerRouter.get('/projects/create', projectManagerController.createProject)
projectManagerRouter.post('/projects/create', projectManagerController.createProject)
projectManagerRouter.get('/projects', projectManagerController.getProjects)
projectManagerRouter.get('/projects/:id', projectManagerController.getProject)
projectManagerRouter.get('/projects/:id/assign-task', projectManagerController.assignTask)

projectManagerRouter.post('/projects/:id', projectManagerController.editProject)
projectManagerRouter.delete('/projects/:id', projectManagerController.deleteProject)

projectManagerRouter.get('/get-members', projectManagerController.getTeamMembers)



export {
    projectManagerRouter
}