import express, { Request, Response, Router } from 'express';
import { IError, ITeacher } from '../@types';
import { MongoHelper } from '../helpers/MongoHelper';

const router: Router = express.Router();

router.get('/teachers', async (req: Request, res: Response) => {
  let arr = await MongoHelper.asArray(MongoHelper.getTeachers());
  res.status(200).json(arr);
});

router.get('/teachers/:uid', async (req: Request, res: Response) => {
  let uid: number = parseInt(req.params.uid);
  if (isNaN(uid)) {
    return res.status(400).json({
      error: {
        message: 'Not a valid teacher id.'
      }
    });
  }
  let teacher: ITeacher | null = await MongoHelper.getTeacher(uid);
  if (teacher) {
    return res.status(201).json(teacher);
  } else {
    res.status(400).json({
      error: {
        message: `No teacher with id: ${uid}`
      }
    });
  }
});

router.post('/teachers', async (req: Request, res: Response) => {
  if (!MongoHelper.isTeacher(req.body.teacher)) {
    let err: IError = {
      error: {
        message: 'Bad JSON.'
      }
    };
    return res.status(400).json({ error: err });
  }
  let teacher: ITeacher = req.body.teacher as ITeacher;
  try {
    await MongoHelper.addTeacher(teacher);
  } catch (err) {
    return res.status(409).json(err);
  }
  res.status(201).json(teacher);
});

router.post('/teachers/:uid/subjectsIds', async (req: Request, res: Response) => {
  // 1 numero, [...] numeri
  let uid: number = parseInt(req.params.uid);
  if (isNaN(uid)) {
    let err: IError = {
      error: {
        message: 'Not a valid teacher id.'
      }
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
      error: {
        message: 'Invalid input. Must be an array of positive numbers.'
      }
    }
    return res.status(400).json({ error: err });
  }
  return res.status(204).json();
});

router.patch('/teachers/:uid', async (req: Request, res: Response) => {
  let uid: number = parseInt(req.params.uid);
  let teacher: Partial<Omit<ITeacher, 'uid'>> = req.body.teacher;
  if (isNaN(uid)) {
    let err: IError = {
      error: {
        message: 'Invalid uid.'
      }
    }
    return res.status(400).json(err);
  }
  try {
    await MongoHelper.updateTeacher(uid, teacher);
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