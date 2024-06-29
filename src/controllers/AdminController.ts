import { Request, Response } from "express";
import { customResponse } from "../utils/custom-response";



export class AdminController {
    private static instance: AdminController;
    private constructor() { }

    static getInstance() {
        if (!AdminController.instance) { AdminController.instance = new AdminController(); }
        return AdminController.instance;
    }

    // Admin Routes Here
    dashboard(req: Request, res: Response) {
        return customResponse({ req, res, view: 'admin/dashboard', data: { title: 'Admin Dashboard' } })
    }





}