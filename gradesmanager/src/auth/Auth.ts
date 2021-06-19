import FetchHelper from '../helpers/FetchHelper';
import internals from './internals.json';
import {
    AuthData,
    IError,
    IUser,
    UserType
    } from '../@types';

class Auth {

    public async login(username: string, password: string) {
        let ok: AuthData | null = null;
        try {
            ok = await FetchHelper.login(username, password);
        } catch (err) {
            // let internal: IUser | null = await this.getInternalAccount(username, password);
            // if (internal) {
            //     return internal;
            // }
            throw err;
        }
        if (ok && ok.user.uid) {
            sessionStorage.setItem('sid', ok.sid);
            sessionStorage.setItem('logged', 'true');
            return ok.user;
        }
        return null;
    }

    public async logout(onlyClientSide?: boolean) {
        if (!onlyClientSide) {
            try {
                await FetchHelper.fetch(`/auth/logout/${sessionStorage.getItem('sid')}`);
            } catch (error) {
                console.error(error);
                return;
            }
        }
        sessionStorage.removeItem('logged');
        sessionStorage.removeItem('sid');
    }

    public async isLoggedIn() {
        let logged = await FetchHelper.fetch(`/auth/_/${sessionStorage.getItem('sid')}`) as boolean;
        if (!logged) await this.logout(true);
        return logged;
    }

    public async getUser(sid?: string) {
        let _sid = !sid ? sessionStorage.getItem('sid') : sid;
        if (_sid === null) {
            return null;
        }
        let data = await FetchHelper.fetch(`/auth/${_sid}`);
        return data;
    }

    public async getUserUid() {
        let sid = sessionStorage.getItem('sid');
        let data = await FetchHelper.fetch(`/auth/${sid}`) as IUser | null;
        if (data) {
            return data.uid;
        }
        return null;
    }

    // public getUserTheme(): 'blue_theme' | 'purple_theme' | null {
    //     return sessionStorage.getItem('theme') as 'blue_theme' | 'purple_theme' | null;
    // }

    // private async getInternalAccount(username: string, password: string) {
    //     for (const acc of internals) {
    //         if (acc.username === username && acc.password === password) {
    //             let uid: number | null = null;
    //             try {
    //                 uid = await FetchHelper.fetchUserUid(username);
    //                 let user: IUser | null = null;
    //                 if (uid) {
    //                     user = await FetchHelper.fetchUser(uid);
    //                 }
    //                 if (!uid || !user) {
    //                     return null;
    //                 }
    //                 return user;
    //             } catch (err) {
    //                 console.error(err);
    //                 return null;
    //             }
    //         }
    //     }
    //     return null;
    // }
}

export default new Auth();