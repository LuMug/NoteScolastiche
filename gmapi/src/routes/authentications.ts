import express, { Request, Response, Router } from 'express';
import {
    IError,
    IGroup,
    IUser,
    UserType
} from '../@types';
import { MongoHelper } from '../helpers/MongoHelper';
import { LDAPClient, PathParser, ADUser } from "ldap-ts-client-test";
import * as _JSON from './../temp.json';
import { ILdapOptions } from 'ldap-ts-client-test/lib/ILdapOptions';

const router: Router = express.Router();

router.get('/authentication', async (req: Request, res: Response) => {
    let opts: ILdapOptions = {
        bindPath: _JSON.bindPath,
        bindPw: _JSON.bindPw,
        bindURL: _JSON.bindURL,
        possiblePaths: _JSON.possiblePaths
    };

    let ldap = new LDAPClient(opts);
    let username: string = req.body.username;
    let fullName: string[] = username.split('.');
    let password: string = req.body.password;
    if (username.length == 0) {
        let err: IError = {
            error: {
                message: 'Not a valid username'
            }
        };
        return res.status(400).json({ error: err });
    }
    if (password.length == 0) {
        let err: IError = {
            error: {
                message: 'Not a valid password'
            }
        }
    };
    try {
        await ldap.start();
        let path: string | undefined = await ldap.getUserPath(username);

        let userFromPath: ADUser;
        if (path != undefined) {
            userFromPath = PathParser.parse(path);
        } else {
            let err: IError = {
                error: {
                    message: 'Not a valid user'
                }
            }
            return res.status(400).json({ error: err });
        }

        let check: boolean = await ldap.checkUserCredentials(username, password);
        if (check) {
            let checkedUser: IUser | null = await MongoHelper.getUserByFullName(fullName[0], fullName[1]);
            if (checkedUser != null) {
                return checkedUser;
            } else {
                //Check group
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
                        MongoHelper.addGroup({
                            name: group
                        });
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
                            return res.status(400).json({ error: err });
                        }
                    }
                    console.log(iuserFromPath);

                    await MongoHelper.addUser(iuserFromPath);
                }
            }
        } else {
            let err: IError = {
                error: {
                    message: 'Username or Password incorrect'
                }
            };
        }
        ldap.end();
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
});

export default router;