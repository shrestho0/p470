import { Request, Response } from "express";
import { customResponse } from "../utils/custom-response";

export class TeamMemberController {
    private static instance: TeamMemberController;
    private constructor() { }

    static getInstance() {
        if (!TeamMemberController.instance) { TeamMemberController.instance = new TeamMemberController(); }
        return TeamMemberController.instance;
    }

    // Admin Routes Here
    dashboard(req: Request, res: Response) {
        return customResponse({ req, res, view: 'team_member/dashboard', data: { title: 'Team Member Dashboard' } })
    }





}