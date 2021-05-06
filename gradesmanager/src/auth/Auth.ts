import FetchHelper from '../helpers/FetchHelper';
import internals from './internals.json';
import { IError, IUser, UserType } from '../@types';

class Auth {

    public async login(username: string, password: string) {
        let ok: IUser | null = null;
        try {
            ok = await FetchHelper.login(username, password);
        } catch (err) {
            let internal: IUser | null = await this.getInternalAccount(username, password);
            if (internal) {
                sessionStorage.setItem('logged', 'true');
                sessionStorage.setItem('uid', internal.uid.toString());
                sessionStorage.setItem('user_type', internal.type);
                return internal;
            }
            throw err;
        }
        if (ok && ok.uid) {
            sessionStorage.setItem('logged', 'true');
            sessionStorage.setItem('uid', ok.uid.toString());
            sessionStorage.setItem('user_type', ok.type);
            return ok;
        } else {
            sessionStorage.setItem('logged', 'false');
            sessionStorage.removeItem('uid');
            return null;
        }
    }

    public logout() {
        sessionStorage.removeItem('logged');
        sessionStorage.removeItem('uid');
        sessionStorage.removeItem('user_type');
    }

    public isLoggedIn(): boolean {
        return (sessionStorage.getItem('logged') == 'true');
    }

    public getUserUid(): number | null {
        let uid = sessionStorage.getItem('uid');
        return (uid) ? parseInt(uid) : null;
    }

    public getUserType(): UserType | null {
        let entry = sessionStorage.getItem('user_type');
        return (entry) ? entry as UserType : null;
    }

    public setUserType(type: UserType) {
        sessionStorage.setItem('user_type', type.toString());
    }

    // public getUserTheme(): 'blue_theme' | 'purple_theme' | null {
    //     return sessionStorage.getItem('theme') as 'blue_theme' | 'purple_theme' | null;
    // }

    private async getInternalAccount(username: string, password: string) {
        for (const acc of internals) {
            if (acc.username === username && acc.password === password) {
                let uid: number | null = null;
                try {
                    uid = await FetchHelper.fetchUserUid(username);
                    let user: IUser | null = null;
                    if (uid) {
                        user = await FetchHelper.fetchUser(uid);
                    }
                    if (!uid || !user) {
                        return null;
                    }
                    return user;
                } catch (err) {
                    console.error(err);
                    return null;
                }
            }
        }
        return null;
    }
}

export default new Auth();