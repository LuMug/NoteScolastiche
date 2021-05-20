import express, { Request, Response, Router } from 'express';
import { MongoHelper } from '../helpers/MongoHelper';
import { UserType } from '../@types';
import { Logger, LoggingCategory } from 'gradesmanager_test_logger';

const dirPath = "./../../Log";
const log: Logger = new Logger(dirPath);
const router: Router = express.Router();

/**
 * Gets all of the students in an array.
 */
router.get('/students', async (req: Request, res: Response) => {
    let arr = await MongoHelper.asArray(MongoHelper.getUsers());
    log.log(`Return students successful`, LoggingCategory.SUCCESS);
    res.status(200).json(arr.filter(v => v.type === UserType.STUDENT));
});

export default router;