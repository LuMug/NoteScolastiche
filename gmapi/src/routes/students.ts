import express, { Request, Response, Router } from 'express';
import { MongoHelper } from '../helpers/MongoHelper';
import { UserType } from '../@types';

const router: Router = express.Router();

router.get('/students', async (req: Request, res: Response) => {
    let arr = await MongoHelper.asArray(MongoHelper.getUsers());
    res.status(200).json(arr.filter(v => v.type === UserType.STUDENT));
});

export default router;