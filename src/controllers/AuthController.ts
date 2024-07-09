import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { sanitizedGotoUrl } from "../utils/utils";

export class AuthController {
    private static instance: AuthController;
    private constructor() { }
    static getInstance() {
        if (!AuthController.instance) { AuthController.instance = new AuthController(); }
        return AuthController.instance;
    }


    // Signin Page
    async signin(req: Request, res: Response): Promise<void> {

        // get goto url
        let goto = sanitizedGotoUrl(req.query.goto as string);

        console.log("Goto from SignIn page", goto)

        if (req.method === 'POST') {

            // check for user data required
            const { email, password } = req.body;
            if (!email || !password) {
                res.render('auth/signin', {
                    error_message: 'All fields are required'
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

            // generate access token
            const tokens = {
                accessToken: await AuthService.generateAccessToken(user),
                refreshToken: await AuthService.generateRefreshToken(user)
            }

            // set tokens in cookie
            // setting time not needed, refresh token will take care
            res.cookie('_auth_token_', JSON.stringify(tokens), { maxAge: 1000 * 60 * 60 * 24 * 15 }) // 15 days


            // redirect to dashboard
            res.cookie('_flash_message_', 'Logged in successfully.', {})
            res.redirect(goto)

            return
            // res.render('misc/redirect', {
            //     message: 'Login successful.',
            //     redirectUrl: goto,
            //     wait_second: 1
            // })




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

            res.cookie('_flash_message_', 'User created successfully. Sign in to access pages.', {})
            res.redirect('/signin')

            // res.render('misc/redirect', {
            //     message: 'User created successfully',
            //     redirectUrl: '/signin'
            // })

            return
        } else {
            res.render('auth/signup', {
                error_message: '',
            })
        }

    }

    async signout(req: Request, res: Response): Promise<void> {
        // delete _auth_token_ cookie
        console.log("Signout")
        res.clearCookie('_auth_token_', {
            path: '/'
        });
        // redirect to signin page
        res.cookie('_flash_message_', 'Signed out successfully', {})
        res.redirect('/signin')
        // res.send('Logged out successfully')
        return
        // res.render('misc/redirect', {
        //     message: 'Logged out successfully',
        //     redirectUrl: '/signin',
        //     wait_second: 1
        // })
    }


}