import * as _JSON from './../temp.json';
import AuthManager from '../AuthManager';
import express, { Request, Response, Router } from 'express';
import { ADUser, LDAPClient, PathParser } from './../../../ldap-ts/lib';
import {
    AuthData,
    IError,
    IGroup,
    ITeacher,
    IUser,
    UserType
    } from '../@types';
import { ILdapOptions } from 'ldap-ts-client-test';
import { logger as getLogger } from '../app';
import { Logger, LoggingCategory } from 'gradesmanager_test_logger';
import { MongoHelper } from '../helpers/MongoHelper';

const router: Router = express.Router();
const logger: Logger = getLogger;

router.get('/auth/:sid', async (req: Request, res: Response) => {
    let sid = req.params.sid;
    return res.status(200).json(await AuthManager.getUserData(sid));
});

router.get('/auth/_/:sid', (req: Request, res: Response) => {
    let sid = req.params.sid;
    return res.status(200).json(AuthManager.map.has(sid));
});

router.get('/auth/logout/:sid', (req: Request, res: Response) => {
    let sid = req.params.sid;
    if (AuthManager.map.has(sid)) {
        AuthManager.map.delete(sid);
        return res.status(200).json();
    } else {
        let err: IError = {
            error: {
                message: `No session with id ${sid}`
            }
        };
        return res.status(404).json(err);
    }
});

/**
 * Authentication route
 * this method need for authenticate the users of AD,
 * create user or teacher if not exists.
 */
router.post('/authentication', async (req: Request, res: Response) => {
    let opts: ILdapOptions = {
        bindPath: _JSON.bindPath,
        bindPw: _JSON.bindPw,
        bindURL: _JSON.bindURL,
        possiblePaths: _JSON.possiblePaths
    };
    let username: string = req.body.username;
    let password: string = req.body.password;
    let fullName: string[] = username.split('.');
    if (username.length === 0 || fullName.length !== 2) {
        let err: IError = {
            error: {
                message: 'Not a valid username'
            }
        };
        return res.status(400).json(err);
    }
    if (password.length == 0) {
        let err: IError = {
            error: {
                message: 'Not a valid password'
            }
        }
        return res.status(400).json(err);
    };
    fullName[0] = fullName[0].substr(0, 1).toUpperCase()
        + fullName[0].substr(1, fullName[0].length - 1);
    fullName[1] = fullName[1].substr(0, 1).toUpperCase()
        + fullName[1].substr(1, fullName[1].length - 1);
    let checkedUser: IUser | null = null;
    try {
        let tempPath: string | null;
        let userFromPath: ADUser = {
            name: fullName[0],
            surname: fullName[1]
        };
        let tempCheck: boolean = true;
        if (!process.env.DEV) {
            let ldap = new LDAPClient(opts);
            await ldap.start();
            tempPath = await ldap.getUserPath(username);
            if (tempPath != undefined) {
                userFromPath = PathParser.parse(tempPath);
            } else {
                let err: IError = {
                    error: {
                        message: 'Not a valid user.'
                    }
                }
                return res.status(400).json(err);
            }
            tempCheck = await ldap.checkUserCredentials(username, password);
            await ldap.end();
        }
        if (tempCheck) {
            checkedUser = await MongoHelper.getUserByFullName(fullName[0], fullName[1]);
            if (checkedUser) {
                let groupName: string;
                let group: IGroup | null = await MongoHelper.getGroup(checkedUser.groupId);
                if (userFromPath.group && userFromPath.year) {
                    groupName = userFromPath.group + userFromPath.year;
                    let returnCode;
                    if (group && group.name == groupName) {
                        logger.log("Login success.", LoggingCategory.SUCCESS);
                        returnCode = 200;
                    } else {
                        await MongoHelper.addGroup({ name: groupName });
                        let groupId = await MongoHelper.getGroupByName(groupName);
                        if (groupId) {
                            await MongoHelper.updateUser(checkedUser.uid, { groupId: groupId?.uid });
                        }
                        logger.log("Login success, group update.", LoggingCategory.SUCCESS);
                        returnCode = 201;
                    }
                    let data: AuthData = {
                        sid: AuthManager.addEntry(checkedUser.uid),
                        user: checkedUser
                    };
                    return res.status(returnCode).json(data);
                } else if (!userFromPath.group && !userFromPath.year && process.env.DEV) {
                    let data: AuthData = {
                        sid: AuthManager.addEntry(checkedUser.uid),
                        user: checkedUser
                    };
                    return res.status(200).json(data);
                }
                else {
                    return res.status(500).json({});
                }
            } else {
                if (isStudent(userFromPath)) {
                    try {
                        await createUser(userFromPath, fullName);
                    } catch (err) {
                        logger.log("Impossible create user.", LoggingCategory.ERROR);
                        return res.status(400).json(err);
                    }
                } else {
                    try {
                        await createTeacher(fullName);
                    } catch (err) {
                        logger.log("Impossible create teacher.", LoggingCategory.ERROR);
                        return res.status(400).json(err);
                    }
                }
                checkedUser = await MongoHelper.getUserByFullName(fullName[0], fullName[1]);
                if (checkedUser) {
                    logger.log("Login success.", LoggingCategory.SUCCESS);
                    return res.status(201).json(checkedUser);
                } else {
                    let err: IError = {
                        error: {
                            message: 'Couldnt find newly created user'
                        }
                    }
                    logger.log("Couldnt find newly created user.", LoggingCategory.ERROR);
                    return res.status(500).json(err);
                }
            }
        } else {
            let err: IError = {
                error: {
                    message: 'Username or Password incorrect'
                }
            };
            return res.status(400).json(err);
        }
    } catch (err) {
        if (typeof err === 'string') {
            return res.status(400).json({ error: { message: err } });
        }
        logger.log("Error in authentication route.", LoggingCategory.ERROR);
        return res.status(400).json(err);
    }
});

const isStudent = (user: ADUser) => {
    if (user.group == '' || user.section == '' || user.year == null) {
        return false;
    } else {
        return true;
    }
}

/**
 * Given a full name and a username of user's AD creates an user.
 * 
 * @param userFromPath username from path given by LDAPClient
 * @param fullName full name of the user
 */
const createUser = async (userFromPath: ADUser, fullName: string[]) => {
    if (userFromPath.group && userFromPath.year) {
        let iuserFromPath: IUser;
        let group: string = userFromPath.group + userFromPath.year;
        let checkGroup: IGroup | null = await MongoHelper.getGroupByName(group)
        if (checkGroup) {
            iuserFromPath = {
                uid: -1,
                name: fullName[0],
                surname: fullName[1],
                groupId: checkGroup.uid,
                subjects: [],
                type: UserType.STUDENT
            }
        } else {
            try {
                await MongoHelper.addGroup({
                    name: group
                });
            } catch (err) {
                throw err;
            }
            let newGroup: IGroup | null = await MongoHelper.getGroupByName(group);
            if (newGroup) {
                iuserFromPath = {
                    uid: -1,
                    name: fullName[0],
                    surname: fullName[1],
                    groupId: newGroup.uid,
                    subjects: [],
                    type: UserType.STUDENT
                }
            } else {
                let err: IError = {
                    error: {
                        message: 'Not a valid group'
                    }
                }
                throw err;
            }
        }
        try {
            await MongoHelper.addUser(iuserFromPath);
        } catch (err) {
            throw err;
        }
    }
}

/**
 * Given a full name of user's AD creates a teacher
 * 
 * @param fullName full name of the teacher
 */
const createTeacher = async (fullName: string[]) => {
    let iteacherFromPath: ITeacher;
    iteacherFromPath = {
        uid: -1,
        name: fullName[0],
        surname: fullName[1],
        subjectsIds: [],
        groupsIds: []
    }
    try {
        await MongoHelper.addTeacher(iteacherFromPath);
    } catch (err) {
        throw err;
    }
};

export default router;