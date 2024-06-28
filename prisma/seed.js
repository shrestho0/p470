
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




]


async function main() {

    dummyUsers.forEach((user) => {
        user.password = bcrypt.hashSync(user.password, 10)
    })

    try {

        const u = await db.user.createMany({
            data: dummyUsers
        })
        console.log("Dummy users seeded successfully.")
    } catch (e) {
        console.error("Failed to seed dummy data.\n\n", e.message)
    }

}

main()