import { Console } from 'console';
import {
    ITeacher,
    IUser,
    IGroup,
    Collections,
    CollectionTypes,
    UserType
} from '../@types';
import { MongoHelper } from './MongoHelper';


/**
 * @author Aris Previtali
 */
export class LoginHelper {

    public static async checkUsername(username: string, password: string) {
        let JSONUser: IUser = this.getUserFromLDAP(username, password);
        let s: string[] = this.splitUsername(username);
        let name: string = s[0];
        let surname: string = s[1];
        if (!(await this.userExists(name, surname))) {
            MongoHelper.addUser(
                {
                    "name": JSONUser.name,
                    "surname": JSONUser.surname,
                    "groupId": JSONUser.groupId,
                    "subjects": JSONUser.subjects,
                    "type": JSONUser.type
                }
            );
        }
    }

    public static async userExists(username: string, surname: string) {
        let user: IUser | null = await MongoHelper.getUserByFullName(username, surname);
        //console.log(user);
        return user != null;
    }

    public static splitUsername(username: string): string[] {
        let s: string[] = username.split('.')
        return s;
    }

    //LDAP method
    public static getUserFromLDAP(username: string, password: string): IUser {
        let user: IUser =
        {
            "uid": 100,
            "name": "Luca",
            "surname": "Muggiasca",
            "groupId": 0,
            "subjects": [],
            "type": UserType.STUDENT
        };
        return user;
    }
}