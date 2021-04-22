import express, { Request, Response, Router } from 'express';
import {
	IError,
	IGrade,
	ITeacher,
	IUser,
	IUserSubject
} from '../@types';
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
		return res.status(200).json(user);
	} else {
		res.status(404).json({
			error: {
				message: `No user with id: ${uid}`
			}
		});
	}
});

router.get('/users/:uid/subjects', async (req: Request, res: Response) => {
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
		return res.status(200).json(user.subjects);
	} else {
		res.status(400).json({
			error: {
				message: `No user with id: ${uid}`
			}
		});
	}
});

router.get('/users/:uid/subjects/:suid', async (req: Request, res: Response) => {
	let uid: number = parseInt(req.params.uid);
	let suid: number = parseInt(req.params.suid);
	if (isNaN(uid)) {
		return res.status(400).json({
			error: {
				message: 'Not a valid user id.'
			}
		});
	}
	if (isNaN(suid) || suid < 0) {
		return res.status(400).json({
			error: {
				message: 'Not a valid subject id.'
			}
		});
	}
	let user: IUser | null = await MongoHelper.getUser(uid);
	if (user) {
		let len = user.subjects.length;
		if (suid < len) {
			return res.status(200).json(user.subjects[suid]);
		}
		return res.status(400).json({
			error: {
				message: `Not a valid subject id. Out of bounds for length ${len}`
			}
		});
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
			error: {
				message: 'Bad JSON.'
			}
		};
		return res.status(400).json(err);
	}
	let user: IUser = req.body.user as IUser;
	try {
		await MongoHelper.addUser(user);
	} catch (err) {
		return res.status(500).json(err);
	}
	res.status(201).json(user);
});

router.patch('/users/:uid', async (req: Request, res: Response) => {
	let uid: number = parseInt(req.params.uid);
	let user: Partial<Omit<IUser, 'uid'>> = req.body.user;
	if (isNaN(uid)) {
		let err: IError = {
			error: {
				message: 'Invalid uid.'
			}
		}
		return res.status(400).json(err);
	}
	try {
		await MongoHelper.updateUser(uid, user);
	} catch (err) {
		let error: IError = {
			error: {
				message: err
			}
		};
		return res.status(400).json(error);
	}
	return res.status(204).json({});
});

router.post('/users/:uid/subjectsIds', async (req: Request, res: Response) => {
	// 1 numero, [...] numeri
	let uid: number = parseInt(req.params.uid);
	if (isNaN(uid)) {
		let err: IError = {
			error: {
				message: 'Not a valid subject id.'
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
			return res.status(500).json({ error: { message: err } });
		}
	} else if (!isNaN(parseInt(input))) {
		try {
			await MongoHelper.addSubjectId(uid, input);
		} catch (err) {
			return res.status(500).json({ error: { message: err } });
		}
	} else {
		let err: IError = {
			error: {
				message: 'Invalid input. Must be an array of positive numbers.'
			}
		}
		return res.status(400).json({ error: err });
	}
	return res.status(201).json({});
});

router.post('/users/:uid/subjects', async (req: Request, res: Response) => {
	let uid: number = parseInt(req.params.uid);
	if (isNaN(uid)) {
		let err: IError = {
			error: {
				message: 'Not a valid user id.'
			}
		};
		return res.status(400).json({ error: err });
	}
	let input: IUserSubject = req.body.subject as IUserSubject;
	if (!MongoHelper.isUserSubject(input)) {
		let err: IError = {
			error: {
				message: "Invalid input. Must be a valid IUserSubject"
			}
		}
		return res.status(400).json({ error: err });
	}
	let teacher: ITeacher | null = null;
	try {
		if (input.teacherId && (!input.teacherName || input.teacherName.trim() == '')) {
			teacher = await MongoHelper.getTeacher(input.teacherId);
			if (teacher) {
				input.teacherName = `${teacher?.surname} ${teacher?.name}`;
			} else {
				input.teacherName = `???`;
			}
		}
		if (!input.teacherId && input.teacherName && input.teacherName.trim() != '') {
			let fullname = input.teacherName.split(' ');
			teacher = await MongoHelper.getTeacherByFullName(fullname[1], fullname[0]);
			if (teacher) {
				input.teacherName = `${teacher.surname} ${teacher.name}`;
				input.teacherId = teacher.uid;
			} else {
				teacher = await MongoHelper.getTeacherByFullName(fullname[0], fullname[1]);
				if (teacher) {
					input.teacherName = `${teacher.surname} ${teacher.name}`;
					input.teacherId = teacher.uid;
				}
			}
		}
		await MongoHelper.addUserSubject(uid, input);
	} catch (err) {
		return res.status(400).json({ error: { message: err } });
	}
	return res.status(201).json({});
});

router.patch('/users/:uuid/subjects/:suid', async (req: Request, res: Response) => {
	let uuid: number = parseInt(req.params.uuid);
	let suid: number = parseInt(req.params.suid);
	let userSubject: IUserSubject = req.body.subject;
	//let user: IUser = MongoHelper.getUser(userUid);
	//user.subjects = req.body.subject;
	if (isNaN(uuid)) {
		let err: IError = {
			error: {
				message: 'Not a valid User id.'
			}
		};
		return res.status(400).json({ error: err });
	}
	if (isNaN(suid)) {
		let err: IError = {
			error: {
				message: 'Not a valid UserSubject id.'
			}
		};
		return res.status(400).json({ error: err });
	}
	try {
		await MongoHelper.updateUserSubject(uuid, userSubject, suid);
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
	return res.status(204).json({});
});

router.post('/users/:uuid/subjects/:suid/grades', async (req: Request, res: Response) => {
	let uuid: number = parseInt(req.params.uuid);
	let suid: number = parseInt(req.params.suid);
	let grade: IGrade = req.body.grade;
	if (isNaN(uuid)) {
		let err: IError = {
			error: {
				message: 'Not a valid User id.'
			}
		};
		return res.status(400).json({ error: err });
	}
	if (isNaN(suid)) {
		let err: IError = {
			error: {
				message: 'Not a valid UserSubject id.'
			}
		};
		return res.status(400).json({ error: err });
	}
	try {
		await MongoHelper.addGrade(uuid, suid, grade);
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
		console.log(err);

		return res.status(400).json(error);
	}
	return res.status(201).json({});
});

router.patch('/users/:uuid/subjects/:suid/grades/:guid', async (req: Request, res: Response) => {
	let uuid: number = parseInt(req.params.uuid);
	let suid: number = parseInt(req.params.suid);
	let guid: number = parseInt(req.params.guid);
	let grade: Partial<IGrade> = req.body.grade;
	if (isNaN(uuid)) {
		let err: IError = {
			error: {
				message: 'Not a valid User id.'
			}
		};
		return res.status(400).json({ error: err });
	}
	if (isNaN(suid)) {
		let err: IError = {
			error: {
				message: 'Not a valid UserSubject id.'
			}
		};
		return res.status(400).json({ error: err });
	}
	if (isNaN(guid)) {
		let err: IError = {
			error: {
				message: 'Not a valid Grade id.'
			}
		};
		return res.status(400).json({ error: err });
	}
	try {
		await MongoHelper.updateGrade(uuid, suid, guid, grade);
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
		console.log(err);

		return res.status(400).json(error);
	}
	return res.status(204).json({});
});

router.delete('/users/:uuid/subjects/:suid/grades/:guid', async (req: Request, res: Response) => {
	let uuid: number = parseInt(req.params.uuid);
	let suid: number = parseInt(req.params.suid);
	let guid: number = parseInt(req.params.guid);
	if (isNaN(uuid)) {
		let err: IError = {
			error: {
				message: 'Not a valid User id.'
			}
		};
		//console.log(uuid);
		return res.status(400).json({ error: err });
	}
	if (isNaN(suid)) {
		let err: IError = {
			error: {
				message: 'Not a valid UserSubject id.'
			}
		};
		return res.status(400).json({ error: err });
	}
	if (isNaN(guid)) {
		let err: IError = {
			error: {
				message: 'Not a valid Grade id.'
			}
		};
		return res.status(400).json({ error: err });
	}
	try {
		await MongoHelper.removeGrade(uuid, suid, guid);
	} catch (err) {
		let error: IError = {
			error: {
				message: err
			}
		};
		return res.status(400).json(error);
	}
	return res.status(200).json({});
});

router.delete('/users/:uid', async (req: Request, res: Response) => {
	let uid: number = parseInt(req.params.uid);
	if (isNaN(uid)) {
		let err: IError = {
			error: {
				message: 'Not a valid user id.'
			}
		};
		return res.status(400).json({ error: err });
	}
	try {
		await MongoHelper.removeUser(uid);
	} catch (err) {
		let error: IError = {
			error: {
				message: err
			}
		};
		return res.status(400).json(error);
	}
	return res.status(200).json({});
});

router.delete('/users/:uid/subjects/:suid', async (req: Request, res: Response) => {
	let uid: number = parseInt(req.params.uid);
	let suid: number = parseInt(req.params.suid);
	if (isNaN(uid)) {
		let err: IError = {
			error: {
				message: 'Not a valid user id.'
			}
		};
		return res.status(400).json({ error: err });
	}
	if (isNaN(suid)) {
		let err: IError = {
			error: {
				message: 'Not a valid userSubject id.'
			}
		};
		return res.status(400).json({ error: err });
	}
	try {
		await MongoHelper.removeUserSubject(uid, suid);
	} catch (err) {
		let error: IError = {
			error: {
				message: err
			}
		};
		return res.status(400).json(error);
	}
	return res.status(200).json({});
});

export default router;