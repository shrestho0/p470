import { NextFunction, Request, Response } from "express";
import { unprotectedRoutes } from "../utils/unprotected-routes";
import { sanitizedGotoUrl } from "../utils/utils";


/**
 * @name GuardMiddleware
 * @description This middleware guards routes / Limits access to routes
 * @param req 
 * @param res 
 * @param next 
 */

export async function GuardMiddleware(req: Request, res: Response, next: NextFunction) {
    const path = req.path;
    const user = req.body.user;
    const flash_message = req.body.flash_message;
    console.log("Entered Guard Middleware", path, user, flash_message)

    if (unprotectedRoutes.includes(path) && !user) {
        next();
        return;
    } else if (!unprotectedRoutes.includes(path) && !user) {
        res.cookie('_flash_message_', 'Please login to access this page', {
            maxAge: 1000 * 60 * 2, // 2 minutes
        })
        res.redirect('/signin' + "?goto=" + sanitizedGotoUrl(req.path))
        return
    } else if (unprotectedRoutes.includes(path) && user) {
        if (path == '/signout') {
            next()
            return
        }
        res.cookie('_flash_message_', 'Already logged in', {})
        res.redirect('/dashboard')
        // res.render('misc/redirect', {
        //     message: 'Already logged in',
        //     redirectUrl: '/dashboard',
        // })
        return
    }


    // if (unprotectedRoutes.includes(path) && !user) {
    //     next();
    //     return;
    // } else if (!unprotectedRoutes.includes(path) && !user) {
    //     res.cookie('_flash_message_', 'Please login to access this page', {
    //         maxAge: 1000 * 60 * 2, // 2 minutes
    //     })
    //     res.redirect('/signin' + "?goto=" + req.path)
    //     return
    // }

    // if (!unprotectedPages.includes(path) && !user) {
    //     res.cookie('_flash_message_', 'Please login to access this page', {
    //         maxAge: 1000 * 60 * 2, // 2 minutes
    //     })
    //     res.redirect('/signin' + "?goto=" + req.path)
    //     return
    // } else if (unprotectedPages.includes(path) && user) {
    //     res.redirect('/dashboard')
    //     return
    // }

    next()
}
