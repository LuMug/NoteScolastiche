import AuthenticationUser from './routes/authentications';
import authMiddleware, { isLoggedIn } from './middlewares/auth';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import GroupsRoute from './routes/groups';
import morgan from 'morgan';
import StudentsRoute from './routes/students';
import TeachersRoute from './routes/teachers';
import UsersRoute from './routes/users';
import { Logger, LoggingCategory } from 'gradesmanager_test_logger';
import { MongoHelper } from './helpers/MongoHelper';
// import SubjectsRoute from './routes/subjects';

const MAIN_ROUTE: string = '/api/v1';
const app = express();
const dirPath = './logs';
export let logger = new Logger(dirPath);

console.log('DEV mode: ' + process.env.DEV || 'no dev');

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authMiddleware);
app.use(isLoggedIn);

app.use(MAIN_ROUTE + '/useruids/:name/:surname', async (req, res, next) => {
    let name = req.params.name;
    let surname = req.params.surname;
    let user;
    try {
        user = await MongoHelper.getUserByFullName(name, surname);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
    if (user) {
        return res.status(200).json(user.uid);
    }
    return res.status(400).json({ error: { message: `user ${name}.${surname} does not exists` } });
});

app.use(MAIN_ROUTE, TeachersRoute);
app.use(MAIN_ROUTE, UsersRoute);
app.use(MAIN_ROUTE, GroupsRoute);
app.use(MAIN_ROUTE, AuthenticationUser);
app.use(MAIN_ROUTE, StudentsRoute);
// app.use(MAIN_ROUTE, SubjectsRoute);

app.get(`${MAIN_ROUTE}/cringe`, (req, res) => {
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

const timeId = setInterval(() => {
    let date = new Date();
    if (date.getHours() === 0 && date.getMinutes() === 0) {
        logger = new Logger(dirPath);
        logger.logNoWrite('Created new logger');
    }
}, 60 * 60);

export default app;