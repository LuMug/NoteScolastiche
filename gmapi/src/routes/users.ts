import express, { Request, Response, Router } from 'express';
import {
    IError,
    IGrade,
    ITeacher,
    IUser,
    IUserSubject
    } from '../@types';
import { Logger, LoggingCategory } from 'gradesmanager_test_logger';
import { MongoHelper } from '../helpers/MongoHelper';

const dirPath = "./logs";
const log: Logger = new Logger(dirPath);
const router: Router = express.Router();

/**
 * Gets all users.
 */
router.get('/users', async (req: Request, res: Response) => {
	let arr = await MongoHelper.asArray(MongoHelper.getUsers());
	log.log(`Return users successful`, LoggingCategory.SUCCESS);
	res.status(200).json(arr);
});

/**
 * Gets a user.
 * 
 * @param uid the unique id of a user
 */
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
		log.log(`Return user with ${uid} successful`, LoggingCategory.SUCCESS);
		return res.status(200).json(user);
	} else {
		log.log(`Can't find user with ${uid}`, LoggingCategory.ERROR);
		res.status(404).json({
			error: {
				message: `No user with id: ${uid}`
			}
		});
	}
});

/**
 * Gets all the user's subjects.
 * 
 * @param uid the unique id of a user
 */
router.get('/users/:uid/subjects', async (req: Request, res: Response) => {
	let uid: number = parseInt(req.params.uid);
	if (isNaN(uid)) {
		return res.status(400).json({
			error: {
				message: 'Not a valid user id.'
			}
		});
	}
	try {
		let user: IUser | null = await MongoHelper.getUser(uid);
		if (user) {
			log.log(`Return user's subjects successful.`, LoggingCategory.SUCCESS);
			return res.status(200).json(user.subjects);
		} else {
			log.log(`Can't find user with ${uid}`, LoggingCategory.ERROR);
			res.status(400).json({
				error: {
					message: `No user with id: ${uid}`
				}
			});
		}
	} catch (err) {
		log.log(`Can't get user with ${uid} from db`, LoggingCategory.ERROR);
		res.status(500).json({
			error: {
				message: `Can't get user with uid: ${uid}`
			}
		});
	}
});


/**
 * Gets a user's subject by passing subject unique id.
 * 
 * @param uid the unique id of the user
 * @param suid the unique id of the subject
 */
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
			log.log(`Return user's subject successful.`, LoggingCategory.SUCCESS);
			return res.status(200).json(user.subjects[suid]);
		}
		log.log(`Can't find user with ${uid}.`, LoggingCategory.ERROR);
		return res.status(400).json({
			error: {
				message: `Not a valid subject id. Out of bounds for length ${len}`
			}
		});
	} else {
		log.log(`Can't get user with ${uid} from db`, LoggingCategory.ERROR);
		res.status(400).json({
			error: {
				message: `No user with id: ${uid}`
			}
		});
	}
});

/**
 * Adds a user.
 */
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
		log.log(`Can't add user`, LoggingCategory.ERROR);
		return res.status(500).json(err);
	}
	log.log(`Add new user successful`, LoggingCategory.SUCCESS);
	res.status(201).json(user);
});

/**
 * Updates a user.
 * 
 * @param uid the unique id of the user
 */
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
		log.log(`Can't update user with ${uid}.`, LoggingCategory.ERROR);
		return res.status(400).json(error);
	}
	log.log(`Update user with uid ${uid} successful`, LoggingCategory.SUCCESS);
	return res.status(204).json({});
});

/**
 * Adds a subjects to a user.
 * 
 * @param uid the unique id of the user
 */
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
			log.log(`Can't add subjects to user with ${uid}.`, LoggingCategory.ERROR);
			return res.status(500).json({ error: { message: err } });
		}
	} else if (!isNaN(parseInt(input))) {
		try {
			await MongoHelper.addSubjectId(uid, input);
		} catch (err) {
			log.log(`Can't add subject to user with ${uid}.`, LoggingCategory.ERROR);
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
	log.log(`Add subjects to user successful.`, LoggingCategory.SUCCESS);
	return res.status(201).json({});
});

/**
 * Adds a subject to a user.
 * 
 * @param uid the unique id of the user
 */
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
		log.log(`Can't add UserSubject to user with ${uid}.`, LoggingCategory.ERROR);
		return res.status(400).json({ error: { message: err } });
	}
	log.log(`Add UserSubject to user with ${uid} successful.`, LoggingCategory.SUCCESS);
	return res.status(201).json({});
});

/**
 * Updates a user's subject.
 * 
 * @param uid the unique id of the user
 * @param suid the unique id of the subject
 */
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
		log.log(`Can't update user's UserSubject.`, LoggingCategory.ERROR);
		return res.status(400).json(error);
	}
	log.log(`Update user's UserSubject successful.`, LoggingCategory.SUCCESS);
	return res.status(204).json({});
});

/**
 * Adds a grade to a user's subject.
 * 
 * @param uid the unique id of the user
 * @param suid the unique id of the subject
 */
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
		log.log(`Can't add grades to user with uid ${uuid}.`, LoggingCategory.ERROR);
		return res.status(400).json(error);
	}
	log.log(`Add grades to user with ${uuid} successful.`, LoggingCategory.SUCCESS);
	return res.status(201).json({});
});

/**
 * Updates a grade of a user's subject.
 * 
 * @param uid the unique id of the user
 * @param suid the unique id of the subject
 * @param guid the unique id of the grade
 */
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
		log.log(`Can't update user's grades.`, LoggingCategory.ERROR);
		return res.status(400).json(error);
	}
	log.log(`Update user's UserSubject successful.`, LoggingCategory.SUCCESS);
	return res.status(204).json({});
});

/**
 * Deletes a grade of a user's subject.
 * 
 * @param uid the unique id of the user
 * @param suid the unique id of the subject
 * @param guid the unique id of the grade
 */
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
		log.log(`Can't delete user's grades from db.`, LoggingCategory.ERROR);
		return res.status(400).json(error);
	}
	log.log(`Delete user's grades successful.`, LoggingCategory.SUCCESS);
	return res.status(200).json({});
});

/**
 * Deletes a user.
 * 
 * @param uid the unique id of the user
 */
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
		log.log(`Can't delete user.`, LoggingCategory.ERROR);
		return res.status(400).json(error);
	}
	log.log(`Delete user successful.`, LoggingCategory.SUCCESS);
	return res.status(200).json({});
});

/**
 * Deletes a user's subjects.
 * 
 * @param uid the unique id of the user
 * @param suid the unique id of the subject
 */
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
		log.log(`Can't delete user's UserSubject from db.`, LoggingCategory.ERROR);
		return res.status(400).json(error);
	}
	log.log(`Delete user's UserSubject successful.`, LoggingCategory.SUCCESS);
	return res.status(200).json({});
});

/**
 * Set hasReadWelcomeMsg to false to all users.
 */
router.patch('/users', async (req: Request, res: Response) => {
	let arr = await MongoHelper.asArray(MongoHelper.getUsers());
	if (arr.length > 0) {
		for (let i = 0; i < arr.length; i++) {
			try {
				await MongoHelper.setHasReadWelcomeMsg(false, arr[i].uid);
			} catch (err) {
				let error: IError = {
					error: {
						message: err
					}
				};
				log.log(`Can't set hasReadWelcomeMsg to users.`, LoggingCategory.ERROR);
				return res.status(400).json(error);
			}
			log.log(`Set hasReadWelcomeMsg to users successful.`, LoggingCategory.SUCCESS);
			return res.status(200).json({});
		}
	} else {
		let error: IError = {
			error: {
				message: "No users."
			}
		};
		return res.status(400).json(error);
	}
});

export default router;