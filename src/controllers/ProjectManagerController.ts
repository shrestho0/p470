import { Request, Response } from "express";
import { customResponse } from "../utils/custom-response";
import { ProjectManagerService } from "../services/ProjectManagerService";
import { Prisma } from "@prisma/client";

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


    async createProject(req: Request, res: Response) {
        if (req.method === "POST") {
            console.log(req.body);

            try {

                const data = {
                    title: req.body["project-title"] as string,
                    summary: req.body["project-summary"] as string,
                    description: req.body["project-description"] as string,
                    milestones: JSON.parse(req.body["project-milestones"] ?? "[]") as {
                        start: string;
                        end: string;
                    }[],
                    members: req.body["members"] ?? [] as string[],
                    managerId: req.body.user["id"]
                };
                console.log("data", data)
                const re = await ProjectManagerService.createProject(data)
                return res.json(re)
            } catch (e) {
                return res.json({
                    success: false,
                    message: "Error Creating Project",
                    data: e
                })
            }

        } else {


            // Create Project Page
            return customResponse({ req, res, view: 'project_manager/projects/create-project', data: { title: 'Create Project' } })
        }
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


    async getProject(req: Request, res: Response) {
        const id = req.params.id as string
        if (id) {
            const project = await ProjectManagerService.getProject({
                id,
                include: {
                    manager: true,
                    milestones: true,
                    members: true
                }
            });
            return customResponse({ req, res, view: 'project_manager/projects/single-project', data: { title: project.title, project } })
        }

        return customResponse({ req, res, view: 'project_manager/projects/single-project', data: { title: 'Project' } })
    }

    async getProjects(req: Request, res: Response) {
        const managerId = req.body.user.id;
        let {
            page = "1",
            limit = "5",
            q = '',
            status = 'ALL' as string
        } = req.query;


        if (status === 'ALL' || !status) status = '';


        const projects = await ProjectManagerService.getProjects(managerId, parseInt(page.toString()), parseInt(limit.toString()), q, status.toString());
        console.log("Projects", projects);
        return customResponse({ req, res, view: 'project_manager/projects/index', data: { title: 'Projects', projects } })
    }

    editProject(req: Request, res: Response) {
        throw new Error('Method not implemented.');
    }
    deleteProject(req: Request, res: Response) {
        throw new Error('Method not implemented.');
    }
}