import { ADUser } from "./ADUser";

/**
 * Used for parse an LDAP path,
 * After parsing, it generates an ADUser.
 * 
 * @author Francisco Viola
 * @version 15.04.2021
 */
export class PathParser {

    public static parse(path: string): ADUser {
        let parts: string[] = path.split(',');
        let userName: string = '';
        let userSurname: string = '';
        let userSection: string = '';
        let userClass: string = '';
        let userYear: string = '';
        if (parts.length == 4) {
            userName = parts[0].split(".")[0];
            userSurname = parts[0].split(".")[1];
            return new ADUser(userName, userSurname);
        } else {
            userName = parts[0].split('=')[1].split(".")[0];
            userSurname = parts[0].split(".")[1];
            userSection = parts[3].split("=")[1];
            userClass = parts[2].split("=")[1];
            userYear = parts[1].split("=")[1];
            return new ADUser(userName, userSurname, userSection,
                userClass, userYear);
        }
    }
}