import FetchHelper from '../helpers/FetchHelper';
import { IUser } from '../@types';

class Auth {

    public async login(username: string, password: string): Promise<number | null> {
        let ok = false;
        let uid: number | null = null;
        let body = {
            username: username,
            password: password
        };
        try {
            ok = await FetchHelper.fetch('/authentication', 'POST', body);
            // Fetches anyway so thath we can have standalone accounts only on our db.
            uid = await FetchHelper.fetchUserUid(username);
        } catch (err) {
            console.error(err);
            return null;
        }
        if (ok && uid || uid) {
            sessionStorage.setItem('logged', 'true');
            sessionStorage.setItem('uid', uid.toString());
        } else {
            sessionStorage.setItem('logged', 'false');
            sessionStorage.removeItem('uid');
        }
        return uid;
    }

    public logout() {
        sessionStorage.setItem('logged', 'false');
    }

    public isLoggedIn(): boolean {
        return (sessionStorage.getItem('logged') == 'true');
    }

    public getUserUid(): number | null {
        let key = sessionStorage.getItem('uid');
        return (key) ? parseInt(key) : null;
    }
}

export default new Auth();