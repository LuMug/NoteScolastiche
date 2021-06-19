import { IUser } from './@types';
import { MongoHelper } from './helpers/MongoHelper';
import { setInterval } from 'timers';

export default class AuthManager {

    static map: Map<string, number> = new Map();

    public static createSID() {
        let ran = Math.round(Math.random() * 9000000000);
        return (Date.now() + ran).toString(16);
    }

    public static addEntry(uid: number) {
        let sid = this.createSID();
        this.map.set(sid, uid);
        return sid;
    }

    public static async getUserData(sid: string) {
        if (!this.map.has(sid)) {
            return null;
        }
        return await MongoHelper.getUser(this.map.get(sid) as number);
    }
}