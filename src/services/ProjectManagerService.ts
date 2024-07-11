import { Prisma, PrismaClient } from "@prisma/client";
import { CommonDataWithPagination } from "../utils/types";
import { TeamMemberService } from "./TeamMemberService";
import db from "../db";

export class ProjectManagerService {

    static async createProject(data: { title: string; managerId: string; summary: string; description: string; milestones: { start: string; end: string; }[]; members: string[]; }) {

        // check if necessary values are present
        // if yes, create project

        const milestones = data.milestones.map((m, idx) => {
            return {
                number: idx + 1,
                start: new Date(m.start),
                end: new Date(m.end)
            }
        }) as Prisma.MilestoneCreateManyInput[];

        if (true) {
            // create project
            try {

                const newProj = await db.project.create({
                    data: {
                        title: data.title,
                        summary: data.summary,
                        description: data.description,
                        milestones: {
                            createMany: {
                                data: milestones,
                            }
                        },
                        manager: {
                            connect: {
                                id: data.managerId
                            }
                        },
                        members: {
                            connect: data.members.map((m) => {
                                return {
                                    id: m
                                }
                            },
                            )
                        }
                    }
                })
                return {
                    success: true,
                    message: "Project Created",
                    data: newProj
                }
            } catch (e) {
                return {
                    success: false,
                    message: "Error Creating Project",
                    data: e
                }
            }

        }


        // const newProjData: Prisma.ProjectCreateInput = {
        //     title: data.name,
        //     summary: data.summary,
        //     description: data.description,

        //     manager: 
        // }
    }


    private static teamMemberService = TeamMemberService;

    static async getTeamMembersAndProjectCount(page: number, limit: number, q: string): Promise<any> {

        console.log("Project Manager Service get Memebers");

        let teamMembers: CommonDataWithPagination;

        if (!q) {
            teamMembers = await this.teamMemberService.findUsers(page, limit, true);
        } else {
            teamMembers = await this.teamMemberService.findUsersByQuery(q, page, limit, true);
        }

        if (!teamMembers) return null;

        // console.log("Team Members", teamMembers)
        // console.log("Team Members", teamMembers.total)

        // console.log("Team Members", typeof teamMembers.data)

        // teamMembers.data.forEach((u) => {
        //     console.log("Project Assigned", u["ProjectAssigned"])
        // })
        // teamMembers.forEach((u) => {
        //     if (u["ProjectAssigned"]) {
        //         console.log("Project Assigned", u[""])
        //         u["projectCount"] = u["ProjectAssigned"].length()
        //         // delete u["ProjectAssigned"]
        //     }

        // })

        return teamMembers;
    }

    static async getProjects(managerId, page, limit, query, status = "", include = {
        manager: true,
        members: true,
        milestones: true

    }) {
        const theProjectWithPagination: CommonDataWithPagination = {
            data: [],
            page: page,
            limit: limit,
            totalItems: 0,
            totalPages: 0,
        }

        const where = {
            managerId: managerId,
        }
        if (query) {
            where["OR"] = [
                {
                    title: {
                        contains: query
                    }
                },
                {
                    summary: {
                        contains: query
                    }
                },
                {
                    description: {
                        contains: query
                    }
                }
            ]
        }
        if (status) {
            where["status"] = status
        }

        try {

            theProjectWithPagination.totalItems = await db.project.count({
                where,
            })

            theProjectWithPagination.totalPages = Math.ceil(theProjectWithPagination.totalItems / limit)


            theProjectWithPagination.data = await db.project.findMany({
                where,
                include,
                skip: (page - 1) * limit,
                take: limit
            })
        } catch (e) {
            console.log(e)
        }

        return theProjectWithPagination;
    }

    static async getProject({ id, include = {
        manager: false,
        milestones: false,
        members: false,
    } }) {
        try {
            const project = await db.project.findFirst({
                where: { id },
                include
            })
            return project
        } catch (e) {
            console.log(e)
        }
    }




}