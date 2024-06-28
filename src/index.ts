
import express, { Express, Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import { baseRouter } from './routers/BaseRouter';
import path from 'path';
import bodyParser from 'body-parser';

//For env File 
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

console.log("F ", __dirname)
// Serve static files
app.use(express.static(path.join(__dirname, 'public')))

// Routers Setup
app.use('', baseRouter);



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});