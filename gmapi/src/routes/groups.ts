import express, { Request, Response, Router } from 'express';
import { IError, IGroup } from '../@types';
import { MongoHelper } from '../helpers/MongoHelper';
import { Logger, LoggingCategory } from 'gradesmanager_test_logger';

const dirPath = "./../../Log";
const log: Logger = new Logger(dirPath);
const router: Router = express.Router();

/**
 * Gets all groups.
 */
router.get('/groups', async (req: Request, res: Response) => {
  let arr = await MongoHelper.asArray(MongoHelper.getGroups());
  log.log('Groups return successfully.', LoggingCategory.SUCCESS);
  res.status(200).json(arr);
});

/**
 * Gets a group.
 * 
 * @param uid the unique id of the group
*/
router.get('/groups/:uid', async (req: Request, res: Response) => {
  let uid: number = parseInt(req.params.uid);
  if (isNaN(uid)) {
    log.log('Not a valid user id.', LoggingCategory.ERROR);
    return res.status(400).json({
      error: {
        message: 'Not a valid user id.'
      }
    });
  }
  let group: IGroup | null = await MongoHelper.getGroup(uid);
  if (group) {
    log.log(`Group return successfully.`, LoggingCategory.SUCCESS);
    return res.status(200).json(group);
  } else {
    log.log(`Groups with uid: ${uid} doesn't exist.`, LoggingCategory.ERROR);
    res.status(400).json({
      error: {
        message: `No group with id: ${uid}`
      }
    });
  }
});


/**
 * Adds a group to the mongoDB's collection.
 */
router.post('/groups', async (req: Request, res: Response) => {
  if (!MongoHelper.isGroup(req.body.group)) {
    let err: IError = {
      error: {
        message: 'Bad JSON.'
      }
    };
    log.log(`Not a valid group.`, LoggingCategory.ERROR);
    return res.status(400).json({ error: err });
  }
  let group: IGroup = req.body.group;
  try {
    await MongoHelper.addGroup(group);
  } catch (err) {
    log.log(`Can't add group to db.`, LoggingCategory.ERROR);
    return res.status(500).json(err);
  }
  log.log(`Create group successful.`, LoggingCategory.SUCCESS);
  res.status(201).json(group);
});

/**
 * Updates a group.
 * 
 * @param uid the unique id of the group
 */
router.patch('/groups/:uid', async (req: Request, res: Response) => {
  let uid: number = parseInt(req.params.uid);
  let group: Partial<Omit<IGroup, 'uid'>> = req.body.group;
  if (isNaN(uid)) {
    let err: IError = {
      error: {
        message: 'Invalid uid.'
      }
    }
    log.log(`Not a valid uid.`, LoggingCategory.WARNING);
    return res.status(400).json(err);
  }
  try {
    await MongoHelper.updateGroup(uid, group);
  } catch (err) {
    let error: IError;
    if (typeof err == 'string') {
      error = {
        error: {
          message: err
        }
      };
    } else {
      error = err;
    }
    log.log(`Can't update the group.`, LoggingCategory.ERROR);
    return res.status(400).json(error);
  }
  log.log(`Update group successful.`, LoggingCategory.SUCCESS);
  return res.status(204).json();
});

export default router;