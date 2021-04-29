import * as _JSON from './../temp.json';
import express, { Request, Response, Router } from 'express';
import { ADUser, LDAPClient, PathParser } from './../../../ldap-ts/lib';
import {
    IError,
    IGroup,
    ITeacher,
    IUser,
    UserType
} from '../@types';
import { ILdapOptions } from 'ldap-ts-client-test/lib/ILdapOptions';
import { MongoHelper } from '../helpers/MongoHelper';

const router: Router = express.Router();


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

    let ldap = new LDAPClient(opts);
    let username: string = req.body.username;
    let fullName: string[] = username.split('.');
    fullName[0] = fullName[0].substr(0, 1).toUpperCase()
        + fullName[0].substr(1, fullName[0].length - 1);
    fullName[1] = fullName[1].substr(0, 1).toUpperCase()
        + fullName[1].substr(1, fullName[1].length - 1);
    let password: string = req.body.password;
    if (username.length == 0) {
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
    let checkedUser: IUser | null = null;
    try {
        await ldap.start();
        console.log(username);

        let tempPath: string | null = await ldap.getUserPath(username);
        console.log(tempPath);


        let userFromPath: ADUser;
        if (tempPath != undefined) {
            userFromPath = PathParser.parse(tempPath);
        } else {
            let err: IError = {
                error: {
                    message: 'Not a valid user'
                }
            }
            return res.status(400).json(err);
        }

        let tempCheck: boolean = await ldap.checkUserCredentials(username, password);
        await ldap.end();
        if (tempCheck) {
            checkedUser = await MongoHelper.getUserByFullName(fullName[0], fullName[1]);
            if (checkedUser) {
                let groupName: string;
                let group: IGroup | null = await MongoHelper.getGroup(checkedUser.groupId);
                if (userFromPath.group && userFromPath.year) {
                    groupName = userFromPath.group + userFromPath.year;
                    if (group && group.name == groupName) {
                        return res.status(200).json(checkedUser);
                    } else {
                        await MongoHelper.addGroup({ name: groupName });
                        let groupId = await MongoHelper.getGroupByName(groupName);
                        if (groupId) {
                            await MongoHelper.updateUser(checkedUser.uid, { groupId: groupId?.uid });
                        }
                        return res.status(201).json(checkedUser);
                    }
                }
            } else {
                if (isStudent(userFromPath)) {
                    try {
                        createUser(userFromPath, fullName);
                    } catch (err) {
                        return res.status(400).json(err);
                    }
                } else {
                    try {
                        createTeacher(fullName);
                    } catch (err) {
                        return res.status(400).json(err);
                    }
                }
                checkedUser = await MongoHelper.getUserByFullName(fullName[0], fullName[1]);
                if (checkedUser) {
                    return res.status(201).json(checkedUser);
                } else {
                    let err: IError = {
                        error: {
                            message: 'Could not create user'
                        }
                    }
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
        await MongoHelper.addUser(iuserFromPath);
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