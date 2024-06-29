import { Prisma } from "@prisma/client";
import db from "../db";
import bcrypt from "bcrypt"

import * as jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

import { Response } from "express";

export class AuthService {

    static async findUserWithEmail(userEmail: string): Promise<Prisma.UserCreateInput | null> {
        try {
            const user = await db.user.findUnique({
                where: {
                    email: userEmail,
                }
            })
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


    static async generateAccessToken(user: Prisma.UserCreateInput): Promise<string> {
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 30 });
    }
    static async generateRefreshToken(user: Prisma.UserCreateInput): Promise<string> {
        return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: 15 * 24 * 60 * 60 }); // 15 days
    }

    static async generateTokens(user: Prisma.UserCreateInput): Promise<{ accessToken: string, refreshToken: string }> {
        return {
            accessToken: await this.generateAccessToken(user),
            refreshToken: await this.generateRefreshToken(user)
        }
    }

    static verifyAccessToken(token: string): boolean {
        try {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            return true;
        } catch (err) {
            return false;
        }
    }

    // // check token expriy
    // static checkTokenExpiry(token: string): boolean {
    //     const decoded = jwt.decode(token) as Prisma.UserCreateInput & {
    //         exp: number;
    //     };

    //     if (decoded.exp && decoded.exp < Date.now() / 1000) {
    //         return true;
    //     }
    //     return false;
    // }

    static verifyRefreshToken(token: string): boolean {
        try {
            jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
            return true;
        } catch (err) {
            return false;
        }
    }

    static getPayload(token: any) {
        // decode token and return payload
        // return jwt.decode(token) as Prisma.UserCreateInput;
        try {
            const payload = jwtDecode(token) as Prisma.UserCreateInput;

            return payload;
        } catch (err) {
            // console.log("Error decoding token", err)
            return null;
        }
    }


}

