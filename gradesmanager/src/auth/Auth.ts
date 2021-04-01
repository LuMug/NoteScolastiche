import { IUser } from '../@types';

class Auth {

    public login(username: string, password: string) {
        sessionStorage.setItem('logged', 'true');
    }

    public logout() {
        sessionStorage.setItem('logged', 'false');
    }

    public isLoggedIn(): boolean {
        return (sessionStorage.getItem('logged') == 'true');
    }

    public getUser(): IUser | null {
        if (sessionStorage.getItem('user'))
            return JSON.parse(sessionStorage.getItem('user') || '');
        else
            return null;
    }
}

export default new Auth();