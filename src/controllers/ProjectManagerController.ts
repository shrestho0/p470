import { Request, Response } from "express";
import { customResponse } from "../utils/custom-response";
import { ProjectManagerService } from "../services/ProjectManagerService";

export class ProjectManagerController {
    private static instance: ProjectManagerController;
    private constructor() { }

    // private projectManagerService = ProjectManagerService;



    static getInstance() {
        if (!ProjectManagerController.instance) { ProjectManagerController.instance = new ProjectManagerController(); }
        return ProjectManagerController.instance;
    }

    // Admin Routes Here
    dashboard(req: Request, res: Response) {
        return customResponse({ req, res, view: 'project_manager/dashboard', data: { title: 'Project Manager Dashboard' } })
    }


    createProject(req: Request, res: Response) {
        if (req.method === "POST") {
            console.log("bpost")
            if (req.headers["content-type"] === "application/json") {
                console.log("POST JSON FOUND",)
                const body = req.body
                console.log("REQUEST BODY", body)
                console.log("USER FOUND", req.body.user)
            }
        }

        // Create Project
        return customResponse({ req, res, view: 'project_manager/projects/create/index', data: { title: 'Create Project' } })
    }

    // Project    
    async getTeamMembers(req: Request, res: Response) {
        res.setHeader('Content-Type', 'application/json');
        const {
            page = 1,
            limit = 10,
            q = '',
        } = req.query;

        console.log(page, limit, q);

        // Search Team Members
        const { total, data } = await ProjectManagerService.getTeamMembersAndProjectCount(Number(page), Number(limit), String(q));
        if (!data) return res.json({ error: 'An error occurred' });
        data.forEach(d => {
            delete d.password;
            if (d.ProjectAssigned) d.projectCount = d.ProjectAssigned.length;
            delete d.ProjectAssigned;
        });
        // console.log(data);
        res.json({ page, limit, q, data, total });

        // return customResponse({ req, res, view: 'project_manager/search_team_members', data: { title: 'Search Team Members', } })
    }


}