import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { Prisma } from "@prisma/client";

/**
 * 
 * @name AuthMiddleware
 * @description This middleware checks for user authentication and sets user to req.body.user
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export async function AuthMiddleware(req: Request, res: Response, next: NextFunction) {




    console.log("AuthMiddleware Entered")

    const context = {
        message: null,
        user: null
    }


    // check for tokens in cookie
    const token = req.cookies?._auth_token_ || '';
    const cookieTokens = { accessToken: '', refreshToken: '' }
    if (token) {
        try {
            const tokens = JSON.parse(token);
            cookieTokens.accessToken = tokens.accessToken;
            cookieTokens.refreshToken = tokens.refreshToken;

            // verify for access token
            if (AuthService.verifyAccessToken(cookieTokens.accessToken)) {
                context.user = AuthService.getPayload(cookieTokens.accessToken);
            } else {
                // access token not valid
                // verify refresh token
                if (AuthService.verifyRefreshToken(cookieTokens.refreshToken)) {
                    // refresh token valid
                    // verify users existance in db
                    const payload = AuthService.getPayload(cookieTokens.refreshToken);
                    const user = await AuthService.findUserWithEmail(payload.email);
                    if (!user) {
                        throw new Error('User not found. Please login again')
                    }
                    const newTokens = await AuthService.generateTokens(user);
                    context.user = user;
                    res.cookie('_auth_token_', JSON.stringify(newTokens), {
                        maxAge: 1000 * 60 * 60 * 24 * 15 // 15 days
                    })
                    // generate new tokens

                } else {
                    throw new Error('Tokens expired or invalid. Please login again')
                }
            }

        } catch (err) {
            // console.log("Error parsing token", err)
            // err.message not null and not undefined
            context.message = err?.message ?? 'Tokens expired or invalid. Please login again'
        }
    } else[
        // No token found in cookie
        context.message = 'Please login to access this page'
    ]


    if (context.user && context.user?.password) {
        // removing jwt stuff
        delete context.user.exp;
        delete context.user.password;
        delete context.user.iat;
    }
    console.log("Context", context)
    req.body.user = context.user as Partial<Prisma.UserCreateInput>;
    req.body.flash_message = context.message;


    // if cookie is present
    // // try to parse the token
    // // check for access token
    // // if access token is valid
    // // // set user to req.body.user
    // // else
    // // check for refresh tokens
    // // if refresh token is valid
    // // // generate new tokens
    // // // set new tokens in cookie
    // // // set user to req.body.user
    // // else
    // // clear tokens
    // // redirect to signin page with message `to login with message: tokens expired or invalid. Please login again`
    // else
    // redirect to signin page with message `to login with message: Please login to access this page`





    console.log("AuthMiddleware Exiting")
    next();




}
