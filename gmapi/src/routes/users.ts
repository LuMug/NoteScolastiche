import express, { Router, Request, Response } from 'express';
import { IError, IUser, IUserSubject } from '../@types';
import { MongoHelper } from '../helpers/MongoHelper';

const router: Router = express.Router();

router.get('/users', async (req: Request, res: Response) => {
    let arr = await MongoHelper.asArray(MongoHelper.getUsers());
    res.status(200).json(arr);
});

router.get('/users/:uid', async (req: Request, res: Response) => {
    let uid: number = parseInt(req.params.uid);
    if (isNaN(uid)) {
        return res.status(400).json({
            error: {
                message: 'Not a valid user id.'
            }
        });
    }
    let user: IUser | null = await MongoHelper.getUser(uid);
    if (user) {
        return res.status(201).json(user);
    } else {
        res.status(400).json({
            error: {
                message: `No user with id: ${uid}`
            }
        });
    }
});

router.post('/users', async (req: Request, res: Response) => {
    if (!MongoHelper.isUser(req.body.user)) {
        let err: IError = {
            message: 'Bad JSON.'
        };
        return res.status(400).json({ error: err });
    }
    let user: IUser = req.body.user as IUser;
    try {
        await MongoHelper.addUser(user);
    } catch (err) {
        return res.status(409).json(err);
    }
    res.status(201).json(user);
});

router.patch('/users/:uid', async (req: Request, res: Response) => {
    let uid: number = parseInt(req.params.uid);
    let user: Partial<Omit<IUser, 'uid'>> = req.body.user;
    if (isNaN(uid)) {
        let err: IError = {
            message: 'Invalid uid.'
        }
        return res.status(400).json(err);
    }
    try {
        await MongoHelper.updateUser(uid, user);
    } catch (err) {
        let error: IError;
        if (typeof err == 'string') {
            error = {
                message: err
            };
        } else {
            error = err;
        }
        return res.status(400).json(error);
    }
    return res.status(204).json();
});

router.post('/users/:uid/subjectsIds', async (req: Request, res: Response) => {
    // 1 numero, [...] numeri
    let uid: number = parseInt(req.params.uid);
    if (isNaN(uid)) {
        let err: IError = {
            message: 'Not a valid teacher id.'
        };
        return res.status(400).json({ error: err });
    }
    let input: any = req.body.subjectsIds;
    if (Array.isArray(input)) {
        // check if all are numbers...
        try {
            await MongoHelper.addSubjectId(uid, ...input);
        } catch (err) {
            return res.status(400).json({ error: { message: err } });
        }
    } else if (!isNaN(parseInt(input))) {
        try {
            await MongoHelper.addSubjectId(uid, input);
        } catch (err) {
            return res.status(400).json({ error: { message: err } });
        }
    } else {
        let err: IError = {
            message: 'Invalid input. Must be an array of positive numbers.'
        }
        return res.status(400).json({ error: err });
    }
    return res.status(204).json();
});

router.post('/users/:uid/subjects', async (req: Request, res: Response) => {
    let uid: number = parseInt(req.params.uid);
    if (isNaN(uid)) {
        let err: IError = {
            message: 'Not a valid user id.'
        };
        return res.status(400).json({ error: err });
    }
    let input: IUserSubject = req.body.subject as IUserSubject;
    //if (input.isUserSubject()) {
    try {
        await MongoHelper.addUserSubject(uid, input);
    } catch (err) {
        return res.status(400).json({ error: { message: err } });
    }
    // } else {
    //     let err: IError = {
    //         message: "Invalid input. Must be a valid array for IUserSubject"
    //     }
    //     return res.status(400).json({ error: err });
    // }
    return res.status(204).json();
});

export default router;