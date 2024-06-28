import { Prisma } from "@prisma/client";
import db from "../db";
import bcrypt from "bcrypt"
export class AuthService {
    static async findUserWithEmail(userEmail: string): Promise<Prisma.UserCreateInput | null> {
        try {
            const user = await db.user.findUnique({
                where: {
                    email: userEmail,
                }
            })
            console.log("UserExists", user)
            return user
        } catch (err) {
        }
        return null;
    }
    // Signin Page
    static async createUser(newUser: Prisma.UserCreateInput): Promise<void> {
        try {
            await db.user.create({
                data: newUser
            })
        } catch (err) {
            console.log(err)
        }
    }

    static async encryptPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    static async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}