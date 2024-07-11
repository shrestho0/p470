
// import { PrismaClient } from '@prisma/client'

const PrismaClient = require('@prisma/client').PrismaClient

const db = new PrismaClient()

const bcrypt = require('bcrypt')


const configDotenv = require('dotenv').config

configDotenv()

/* Data */


const dummyUsers = [
    {
        name: 'Admin One',
        email: 'admin@example.com',
        password: 'admin@example.com',
        emailVerified: true,
        role: 'ADMIN'
    },

    {
        name: 'Project Manager One',
        email: 'pm01@example.com',
        password: 'pm01@example.com',
        emailVerified: true,
        teamMemberVerified: true,
        role: 'PROJECT_MANAGER',
    },

    {
        name: 'Team Member One',
        email: 'tm01@example.com',
        password: 'tm01@example.com',
        emailVerified: true,
        teamMemberVerified: true,
        role: 'TEAM_MEMBER'
    },

    {
        name: 'Team Member Two',
        email: 'tm02@example.com',
        password: 'tm02@example.com',
        emailVerified: true,
        teamMemberVerified: true,
        role: 'TEAM_MEMBER'
    },

    {
        name: 'Team Member Three',
        email: 'tm03@example.com',
        password: 'tm03@example.com',
        emailVerified: true,
        teamMemberVerified: true,
        role: 'TEAM_MEMBER'
    },

    {
        name: 'Team Member Four',
        email: 'tm04@example.com',
        password: 'tm04@example.com',
        emailVerified: true,
        teamMemberVerified: true,
        role: 'TEAM_MEMBER'
    },
    {
        name: 'Team Member Five',
        email: 'tm05@example.com',
        password: 'tm05@example.com',
        emailVerified: true,
        teamMemberVerified: true,
        role: 'TEAM_MEMBER'
    },
    {
        "name": "Team Member Six",
        "email": "tm06@example.com",
        "password": "tm06@example.com",
        "emailVerified": true,
        "teamMemberVerified": true,
        "role": "TEAM_MEMBER"
    },
    {
        "name": "Team Member Seven",
        "email": "tm07@example.com",
        "password": "tm07@example.com",
        "emailVerified": true,
        "teamMemberVerified": true,
        "role": "TEAM_MEMBER"
    },
    {
        "name": "Team Member Eight",
        "email": "tm08@example.com",
        "password": "tm08@example.com",
        "emailVerified": true,
        "teamMemberVerified": true,
        "role": "TEAM_MEMBER"
    },
    {
        "name": "Team Member Nine",
        "email": "tm09@example.com",
        "password": "tm09@example.com",
        "emailVerified": true,
        "teamMemberVerified": true,
        "role": "TEAM_MEMBER"
    },
    {
        "name": "Team Member Ten",
        "email": "tm10@example.com",
        "password": "tm10@example.com",
        "emailVerified": true,
        "teamMemberVerified": true,
        "role": "TEAM_MEMBER"
    }





]




async function main() {

    dummyUsers.forEach((user) => {
        user.password = bcrypt.hashSync(user.password, 10)
    })
    console.log("Dummy users seeded successfully.")

    try {

        const u = await db.user.createMany({
            data: dummyUsers
        })


        const pm01 = await db.user.findUnique({
            where: {
                email: 'pm01@example.com'
            }
        })

        if (pm01) {
            const project = await db.project.create({
                data: {
                    id: "project01",
                    title: "Project One",
                    summary: "This is a summary of Project One",
                    description: "This is a description of Project One",
                    manager: {
                        connect: {
                            id: pm01.id
                        }
                    },
                    status: 'ACTIVE',
                    milestones: {
                        createMany: {
                            data: [
                                {
                                    number: 1,
                                    start: new Date("2024-07-10"),
                                    end: new Date("2024-07-12"),
                                },
                                {
                                    number: 2,
                                    start: new Date("2024-07-12"),
                                    end: new Date("2024-07-14"),
                                },
                                {
                                    number: 3,
                                    start: new Date("2024-07-14"),
                                    end: new Date("2024-07-16"),
                                }
                            ]
                        },
                    }
                }
            })

            console.log("Project One created successfully.")

            const tm01 = await db.user.findUnique({
                where: {
                    email: 'tm01@example.com'
                }
            })
            const tm02 = await db.user.findUnique({
                where: {
                    email: 'tm02@example.com'
                }
            })

            const tm03 = await db.user.findUnique({
                where: {
                    email: 'tm03@example.com'
                }
            })

            // Updating with user
            await db.user.update({
                where: {
                    id: tm01.id
                },
                data: {
                    ProjectAssigned: {
                        connect: {
                            id: project.id

                        }
                    }
                }
            })

            // Update the project itself
            await db.project.update({
                where: {
                    id: project.id
                },
                data: {
                    members: {
                        connect: [
                            { id: tm02.id },
                            { id: tm03.id },
                        ]
                    }
                }
            })


            // add tasks
            const t1 = await db.task.createMany({
                data: [
                    {
                        id: "withoutreport01",
                        title: "Task One",
                        description: "This is a description of Task One",
                        priority: "HIGH",
                        projectId: project.id,
                        status: "ASSIGNED",
                        due_date: new Date("2024-07-10"),
                        assigneeId: tm01.id

                    },
                    {
                        id: "withoutreport02",
                        title: "Task Two",
                        description: "This is a description of Task Two",
                        priority: "MEDIUM",
                        projectId: project.id,
                        status: "ASSIGNED",
                        due_date: new Date("2024-07-12"),
                        assigneeId: tm02.id
                    },
                    {
                        id: "withoutreport03",
                        title: "Task Three",
                        description: "This is a description of Task Three",
                        priority: "LOW",
                        projectId: project.id,
                        status: "ASSIGNED",
                        due_date: new Date("2024-07-14"),
                        assigneeId: tm03.id
                    },
                    {
                        id: "withreport01",
                        title: "Task Four",
                        description: "This is a description of Task Four",
                        priority: "HIGH",
                        projectId: project.id,
                        status: "RE_ASSIGNED",
                        due_date: new Date("2024-07-16"),
                        assigneeId: tm01.id
                    },
                    {
                        id: "withreport02",
                        title: "Task Five",
                        description: "This is a description of Task Five",
                        priority: "MEDIUM",
                        projectId: project.id,
                        status: "ON_REVIEW",
                        due_date: new Date("2024-07-18"),
                        assigneeId: tm02.id
                    },

                ],

            })

            console.log("Team Members assigned to Project One successfully.")

            await db.report.createMany({

                data: [
                    {
                        taskId: "withreport01",
                        status: "REJECTED",
                        comment_from_assignee: "This is a comment from assignee",
                        comment_from_project_manager: "This is a comment from reviewer",

                    },
                    {
                        taskId: "withreport02",
                        status: "APPROVED",
                        comment_from_assignee: "This is a comment from assignee",
                        comment_from_project_manager: "This is a comment from reviewer",
                    },
                    {
                        taskId: "withreport02",
                        status: "REJECTED",
                        comment_from_assignee: "This is a comment from assignee",
                        comment_from_project_manager: "This is a comment from reviewer",


                    }
                ]


            }

            )

            console.log("Report assigned")

        }


    } catch (e) {
        console.error("Failed to seed dummy data.\n\n", e.message)
    }

}

main()