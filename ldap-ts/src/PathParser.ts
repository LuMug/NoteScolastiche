import { ADUser } from "./ADUser";

/**
 * @author Francisco Viola
 */
export class PathParser {

    public static parse(path: string): ADUser {
        let parts: string[] = path.split(',');
        let userName: string = '';
        let userSurname: string = '';
        let userSection: string = '';
        let userClass: string = '';
        let userYear: string = '';
        if (parts.length != 0) {
            userName = parts[0].split('=')[1].split(".")[0];
            userSurname = parts[0].split(".")[1];
            userSection = parts[3].split("=")[1];
            userClass = parts[2].split("=")[1];
            userYear = parts[1].split("=")[1];
            return new ADUser(userName, userSurname, userSection,
                userClass, userYear);
        } else {
            userName = parts[0].split(".")[0];
            userSurname = parts[0].split(".")[1];
            return new ADUser(userName, userSurname);
        }
    }
}