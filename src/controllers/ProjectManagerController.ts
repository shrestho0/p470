import { Request, Response } from "express";
import { customResponse } from "../utils/custom-response";

export class ProjectManagerController {
    private static instance: ProjectManagerController;
    private constructor() { }

    static getInstance() {
        if (!ProjectManagerController.instance) { ProjectManagerController.instance = new ProjectManagerController(); }
        return ProjectManagerController.instance;
    }

    // Admin Routes Here
    dashboard(req: Request, res: Response) {
        return customResponse({ req, res, view: 'project_manager/dashboard', data: { title: 'Project Manager Dashboard' } })
    }


    createProject(req: Request, res: Response) {
        // Create Project
        return customResponse({ req, res, view: 'project_manager/create_project', data: { title: 'Create Project' } })
    }



}