import express, { Router, Request, Response } from 'express';
import { IError, ISubject } from '../@types';
import { MongoHelper } from '../helpers/MongoHelper';

const router: Router = express.Router();

router.get('/subjects', async (req: Request, res: Response) => {
    let arr = await MongoHelper.asArray(MongoHelper.getSubjects());
    res.status(200).json(arr);
});

router.get('/subjects/:uid', async (req: Request, res: Response) => {
    let uid: number = parseInt(req.params.uid);
    if (isNaN(uid)) {
        return res.status(400).json({
            error: {
                message: 'Not a valid subject id.'
            }
        });
    }
    let subject: ISubject | null = await MongoHelper.lgetSubject(uid);
    if (subject) {
        return res.status(201).json(subject);
    } else {
        res.status(400).json({
            error: {
                message: `No subject with id: ${uid}`
            }
        });
    }
});


//NON AGGIUNGE IL NOME NEL SUBJECT
router.post('/subjects', async (req: Request, res: Response) => {
    if (!MongoHelper.isSubject(req.body.subject)) {
        let err: IError = {
            message: 'Bad JSON.'
        };
        return res.status(400).json({ error: err });
    }
    let subject: ISubject = req.body.subject;//as ISubject;
    try {
        await MongoHelper.addSubject(subject);
    } catch (err) {
        return res.status(409).json(err);
    }
    res.status(201).json(subject);
});

router.patch('/subjects/:uid', async (req: Request, res: Response) => {
    let uid: number = parseInt(req.params.uid);
    let subject: Partial<Omit<ISubject, 'uid'>> = req.body.subject;
    if (isNaN(uid)) {
        let err: IError = {
            message: 'Invalid uid.'
        }
        return res.status(400).json(err);
    }
    try {
        await MongoHelper.updateSubject(uid, subject);
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

export default router;