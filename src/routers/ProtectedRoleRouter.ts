
import express from 'express';
import { adminRouter } from './AdminRouter';
import { projectManagerRouter } from './ProjectManagerRouter';
import { teamMemberRouter } from './TeamMemberRouter';

const protectedRoleRouter = express.Router()


protectedRoleRouter.use('/admin', adminRouter);
protectedRoleRouter.use('/project_manager', projectManagerRouter);
protectedRoleRouter.use('/team_member', teamMemberRouter)

export {
    protectedRoleRouter
}