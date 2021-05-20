import express, { Request, Response, Router } from 'express';
import { LoggingCategory } from 'gradesmanager_test_logger';
import { MongoHelper } from '../helpers/MongoHelper';
import { UserType } from '../@types';
import { getLogger } from '../app';


const logger = getLogger();
const router: Router = express.Router();

/**
 * Gets all of the students in an array.
 */
router.get('/students', async (req: Request, res: Response) => {
    let arr = await MongoHelper.asArray(MongoHelper.getUsers());
    logger.log(`Return students successful`, LoggingCategory.SUCCESS);
    res.status(200).json(arr.filter(v => v.type === UserType.STUDENT));
});

export default router;