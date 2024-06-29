
import express, { Express, Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import { baseRouter } from './routers/BaseRouter';
import path from 'path';
import bodyParser from 'body-parser';
import { AuthMiddleware } from './middlewares/AuthMiddleware';

import cookieParser from 'cookie-parser';
import { GuardMiddleware } from './middlewares/GuardMiddleware';

// For env File 
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser())

// console.log("F ", __dirname)
// Serve static files
app.use(express.static(path.join(__dirname, 'public')))

// add user to express request object


// Auth Guard Middlewares
// Sets user to req.body.user if user is logged in
app.use(AuthMiddleware);

// Guards pages
// Limits access to pages
app.use(GuardMiddleware)


// Routers Setup
app.use('', baseRouter)

app.use('', (req: Request, res: Response) => {
    res.status(404).send('Page not found')
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});