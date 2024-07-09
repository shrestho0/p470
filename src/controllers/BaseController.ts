import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { Prisma } from "@prisma/client";
import { customResponse } from "../utils/custom-response";

export class BaseController {

    private static instance: BaseController;
    private constructor() { }
    static getInstance() {
        if (!BaseController.instance) { BaseController.instance = new BaseController(); }
        return BaseController.instance;
    }

    // Index / Home Page
    async index(req: Request, res: Response): Promise<void> {
        customResponse({ req, res, view: 'index', data: { title: 'Home' } })
    }

    async dashboard(req: Request, res: Response): Promise<void> {
        // check user role and redirect to corresponding pages

        const user: Prisma.UserCreateInput = req.body.user;
        if (user.role === 'ADMIN') {
            res.redirect(307, '/admin/dashboard')
        } else if (user.role === 'PROJECT_MANAGER') {
            res.redirect(307, '/project_manager/dashboard')
        } else if (user.role === 'TEAM_MEMBER') {
            res.redirect(307, '/team_member/dashboard')
        }

        return

    }


}
