import { Request, Response } from "express"

export function customResponse(params: { req: Request, res: Response, view: string, data: any }) {
    const { req, res, view, data } = params

    if (!data || typeof data !== 'object') {
        throw new Error('Data must be an object')
    }

    res.render(view, {
        ...data,
        user: req.body.user,
    })
    return
}
