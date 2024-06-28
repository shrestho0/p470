import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/AuthServices";

export class BaseController {

    private static instance: BaseController;
    private constructor() { }
    static getInstance() {
        if (!BaseController.instance) { BaseController.instance = new BaseController(); }
        return BaseController.instance;
    }

    // Index / Home Page
    async index(req: Request, res: Response): Promise<void> {
        res.render('index', {
            message: 'Hello World'
        })
    }

    // Signin Page
    async signin(req: Request, res: Response): Promise<void> {

        if (req.method === 'POST') {

            // check for user data required
            const { email, password } = req.body;
            if (!email || !password) {
                res.render('auth/signin', {
                    message: 'All fields are required'
                })
                return
            }

            // find user with email
            const user = await AuthService.findUserWithEmail(email);
            console.log("User", user)
            if (!user) {
                res.render('auth/signin', {
                    error_message: 'User not found. Check your email and password'
                })
                return
            }

            // compare password
            const isMatch = await AuthService.comparePassword(password, user.password);
            if (!isMatch) {
                res.render('auth/signin', {
                    error_message: 'Password is incorrect'
                })
                return
            }

            // redirect to dashboard
            res.render('misc/redirect', {
                message: 'Login successful.',
                redirectUrl: '/dashboard'
            })




        } else {
            res.render('auth/signin', {
                title: 'Signin Page'
            })
        }
    }


    // Signup Page
    async signup(req: Request, res: Response): Promise<void> {

        // get request method from req
        const method = req.method;

        // if request method is POST
        if (method === 'POST') {
            // get form data from req.body
            const { name, email, password, role } = req.body;
            if (!name || !email || !password || !role) {
                res.render('auth/signup', {
                    error_message: 'All fields are required',
                })
                return
            }

            const oldUser = await AuthService.findUserWithEmail(email)
            console.log("OldUser", oldUser)
            if (oldUser != null) {
                res.render('auth/signup', {
                    error_message: 'User already exists',
                })
                return
            }

            if (role != 'PROJECT_MANAGER' && role != 'TEAM_MEMBER') {
                res.render('auth/signup', {
                    error_message: 'Invalid role',
                })
                return
            }

            if (password.length < 8) {
                res.render('auth/signup', {
                    error_message: 'Password must be at least 8 characters long',
                })
                return
            }

            const encryptedPassword = await AuthService.encryptPassword(password);

            // create new user
            await AuthService.createUser({
                email,
                password: encryptedPassword,
                role,
                name
            });


            // redirect to signin page

            res.render('misc/redirect', {
                message: 'User created successfully',
                redirectUrl: '/signin'
            })

            return
        } else {
            res.render('auth/signup', {
                error_message: '',
            })
        }

    }
}
