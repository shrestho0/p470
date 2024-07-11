import { Prisma } from "@prisma/client";
import db from "../db";
import { CommonDataWithPagination } from "../utils/types";


export class TeamMemberService {



    static async findUsersByQuery(userQuery: string, page: number, limit: number, projects = false): Promise<CommonDataWithPagination> {

        let returnObj = {
            totalItems: 0,
            totalPages: 0,
            data: [],
            page,
            limit
        } as CommonDataWithPagination
        const where: Prisma.UserWhereInput = {
            OR: [
                {
                    name: {
                        contains: userQuery
                    }
                },
                {
                    email: {
                        contains: userQuery
                    }
                }
            ],
            role: 'TEAM_MEMBER',

        }



        try {
            returnObj.totalItems = await db.user.count({
                where
            })

            // total pages
            returnObj.totalPages = Math.ceil(returnObj.totalItems / limit)

            returnObj.data = await db.user.findMany({

                where,

                include: {
                    ProjectAssigned: projects
                },


                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    name: 'asc',
                },

            })
        } catch (err) {
            console.error("TEMPORARY ERROR FROM TEAM MEMBER SERVICE", err)
        }

        return returnObj
    }

    static async findUsers(page: number, limit: number, projects = false): Promise<CommonDataWithPagination> {

        let returnObj = {
            totalItems: 0,
            totalPages: 0,
            data: [],
            page,
            limit
        } as CommonDataWithPagination

        const where = {
            role: 'TEAM_MEMBER',
        } as Prisma.UserWhereInput

        try {

            returnObj.totalItems = await db.user.count({
                where
            })

            // total pages
            returnObj.totalPages = Math.ceil(returnObj.totalItems / limit)

            returnObj.data = await db.user.findMany({

                where,
                include: {
                    ProjectAssigned: projects,
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    name: 'asc',
                }
            })
        } catch (err) {
            console.error("TEMPORARY ERROR FROM TEAM MEMBER SERVICE", err)
        }

        return returnObj


    }
} 