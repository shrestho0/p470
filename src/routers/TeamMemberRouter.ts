

import express from 'express';
import { TeamMemberController } from '../controllers/TeamMemberController';
const teamMemberRouter = express.Router();

const teamMemberController = TeamMemberController.getInstance();

// Team Member Routes Here

teamMemberRouter.get('/dashboard', teamMemberController.dashboard)

export {
    teamMemberRouter
}