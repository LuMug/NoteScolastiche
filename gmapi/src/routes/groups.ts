import express, { Request, Response, Router } from 'express';
import { IError, IGroup } from '../@types';
import { MongoHelper } from '../helpers/MongoHelper';

const router: Router = express.Router();

router.get('/groups', async (req: Request, res: Response) => {
  let arr = await MongoHelper.asArray(MongoHelper.getGroups());
  res.status(200).json(arr);
});

router.get('/groups/:uid', async (req: Request, res: Response) => {
  let uid: number = parseInt(req.params.uid);
  if (isNaN(uid)) {
    return res.status(400).json({
      error: {
        message: 'Not a valid user id.'
      }
    });
  }
  let group: IGroup | null = await MongoHelper.getGroup(uid);
  if (group) {
    return res.status(201).json(group);
  } else {
    res.status(400).json({
      error: {
        message: `No group with id: ${uid}`
      }
    });
  }
});


//NON AGGIUNGE IL NOME NEL group
router.post('/groups', async (req: Request, res: Response) => {
  if (!MongoHelper.isGroup(req.body.group)) {
    let err: IError = {
      error: {
        message: 'Bad JSON.'
      }
    };
    return res.status(400).json({ error: err });
  }
  let group: IGroup = req.body.group;
  try {
    await MongoHelper.addGroup(group);
  } catch (err) {
    return res.status(409).json(err);
  }
  res.status(201).json(group);
});

router.patch('/groups/:uid', async (req: Request, res: Response) => {
  let uid: number = parseInt(req.params.uid);
  let group: Partial<Omit<IGroup, 'uid'>> = req.body.group;
  if (isNaN(uid)) {
    let err: IError = {
      error: {
        message: 'Invalid uid.'
      }
    }
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
    return res.status(400).json(error);
  }
  return res.status(204).json();
});

export default router;