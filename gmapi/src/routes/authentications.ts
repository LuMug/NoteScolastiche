import express, { Request, Response, Router } from 'express';
import {
    IError,
    IGroup,
    ITeacher,
    IUser,
    UserType
} from '../@types';
import { MongoHelper } from '../helpers/MongoHelper';
import { LDAPClient, PathParser, ADUser } from 'ldap-ts-client-test';
import * as _JSON from './../temp.json';
import { ILdapOptions } from 'ldap-ts-client-test/ILdapOptions';

const router: Router = express.Router();

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
    try {
        await ldap.start();
        let tempPath: string | undefined = await ldap.getUserPath(username);

        let userFromPath: ADUser;
        if (tempPath != undefined) {
            userFromPath = PathParser.parse(tempPath);
        } else {
            let err: IError = {
                error: {
                    message: 'Not a valid user'
                }
            }
            return res.status(400).json({ error: err });
        }

        let tempCheck: boolean = await ldap.checkUserCredentials(username, password);
        if (tempCheck) {
            let checkedUser: IUser | null = await MongoHelper.getUserByFullName(fullName[0], fullName[1]);
            if (checkedUser != null) {
                return res.status(200).json(checkedUser);
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
            }
        } else {
            let err: IError = {
                error: {
                    message: 'Username or Password incorrect'
                }
            };
            return res.status(400).json(err);
        }
        ldap.end();

    } catch (err) {
        return res.status(400).json(err);
    }
    return res.status(201).json({});
});

const isStudent = (user: ADUser) => {
    if (user.section == undefined && user.group == undefined) {
        return false;
    } else {
        return true;
    }
}

const createUser = async (userFromPath: ADUser, fullName: string[]) => {
    if (userFromPath.group && userFromPath.year) {
        let iuserFromPath: IUser;
        let group: string = userFromPath.group + userFromPath.year;
        let checkGroup: IGroup | null = null;
        try {
            checkGroup = await MongoHelper.getGroupByName(group);
        } catch (err) {
            throw err;
        }
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
            let newGroup: IGroup | null
            try {
                await MongoHelper.addGroup({
                    name: group
                });
                newGroup = await MongoHelper.getGroupByName(group);
            } catch (err) {
                throw err;
            }
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

const createTeacher = async (fullName: string[]) => {
    let iuserFromPath: IUser;
    iuserFromPath = {
        uid: -1,
        name: fullName[0],
        surname: fullName[1],
        groupId: -1,
        subjects: [],
        type: UserType.TEACHER
    }
    let iteacherFromPath: ITeacher;
    iteacherFromPath = {
        uid: -1,
        name: fullName[0],
        surname: fullName[1],
        subjectsIds: [],
        groupsIds: []
    }
    try {
        await MongoHelper.addUser(iuserFromPath);
        await MongoHelper.addTeacher(iteacherFromPath);
    } catch (err) {
        throw err;
    }
};

export default router;