import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import TeachersRoute from './routes/teachers';
import UsersRoute from './routes/users';
// import SubjectsRoute from './routes/subjects';
import GroupsRoute from './routes/groups';

const MAIN_ROUTE: string = '/api/v1/';
const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(MAIN_ROUTE, TeachersRoute);
app.use(MAIN_ROUTE, UsersRoute);
app.use(MAIN_ROUTE, GroupsRoute);
// app.use(MAIN_ROUTE, SubjectsRoute);

app.get(`${MAIN_ROUTE}cringe`, (req, res) => {
    res.send("POG");
});

// Error handling
app.use((req: Request, res: Response, next: NextFunction) => {
    const error = {
        status: 404,
        message: 'Not found'
    };
    next(error);
});
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500);
    res.json(
        {
            error: {
                message: error.message
            }
        }
    );
});


export default app;