import { Request, Response } from "express";
import { customResponse } from "../utils/custom-response";
import { ProjectManagerService } from "../services/ProjectManagerService";
import { $Enums, Prisma } from "@prisma/client";

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


    async getProject(req: Request, res: Response) {
        const id = req.params.id as string
        if (id) {
            const project = await ProjectManagerService.getProject({
                id,
                include: {
                    manager: true,
                    milestones: true,
                    members: true,
                    tasks: true,
                    _count: true
                }
            });

            if (project) {
                project?.members?.length &&
                    project.members.forEach((member) => {
                        delete member.password
                    })

                project?.manager?.id && delete project.manager.password
            }

            return customResponse({ req, res, view: 'project_manager/projects/single-project', data: { title: project.title, project } })
        }

        return customResponse({ req, res, view: 'project_manager/projects/single-project', data: { title: 'Project' } })
    }

    async createTaskJSON(req: Request, res: Response) {
        const projectId = req.params.id as string;
        console.log("Assign Task Post", req.body);
        try {

            const {
                title,
                description,
                milestone,
                due_date,
                priority,
                assignee,
            } = req.body;


            const tData: Prisma.TaskCreateInput = {
                title: "",
                project: {
                    connect: {
                        id: projectId
                    },

                }
            }

            if (title) tData.title = title;
            if (description) tData.description = description;
            if (milestone) tData.milestoneNo = parseInt(milestone ?? "0") ? 0 : null;
            if (due_date) tData.due_date = new Date(due_date);
            if (priority) tData.priority = priority as $Enums.Priority;
            if (assignee) tData.assignee = {
                connect: {
                    id: assignee
                }
            }




            const task = await ProjectManagerService.createTask(tData)

            return res.json({ success: true, message: 'Task assigned successfully', task });
        } catch (e) {
            return res.json({ success: false, message: 'Error assigning task' });
        }
    }

    async assignTask(req: Request, res: Response) {
        const context = {
            title: 'Assign Task',
            project: null,
        }

        const id = req.params.id as string

        try {
            const project = await ProjectManagerService.getProject({
                id,
                include: {
                    manager: true,
                    milestones: true,
                    members: true
                }
            });
            context.project = project;
        } catch (e) {
            context.title = 'Assign task | Error';
        }


        return customResponse({ req, res, view: 'project_manager/projects/create-and-assign-task', data: context })
    }



    editProject(req: Request, res: Response) {
        throw new Error('Method not implemented.');
    }
    deleteProject(req: Request, res: Response) {
        throw new Error('Method not implemented.');
    }





    /**
     * Task Specific Stuff
     * TODO: Fix unsorted ones. 
     * TODO: Clean code is necessary and delete this line. 
     */



    // TODO: There can be a middleware that checks for projects/:id for all, check if id valid and return success false and message
    // Thus, we do not need to handle from every controller or service for this specific one 

    async getProjectTasks(req: Request, res: Response) {
        // TODO: add search filtering to this
        // TODO: send like [ tasks[], tasks[] ], separated by milestones 

        const id = req.params.id

        const context = {
            tasks: null
        }

        // Get tasks project specific
        context.tasks = await ProjectManagerService.getTasksByProjectId(id)


        console.log("[DEBUG] getProjectTasks", context)


        return customResponse({
            req, res,
            view: "project_manager/projects/project-tasks-list",
            data: context,
        })

    }


    async getProjectTask(req: Request, res: Response) {
        const { taskId } = req.params
        const context = { task: null }

        context.task = await ProjectManagerService.getTask({
            id: taskId,
            include: {
                project: true,
                assignee: true,
                reports: true,
                _count: true
            }
        })

        return customResponse({
            req,
            res,
            view: 'project_manager/projects/single-task',
            data: context
        })




    }


}