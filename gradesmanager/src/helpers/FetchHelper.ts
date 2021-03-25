import { API_URL } from '../util/constants';
import {
    IGrade,
    ITeacher,
    IUser,
    IUserSubject
    } from '../@types';

type Methods = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export default class FetchHelper {

    private static URL = API_URL.substr(0, API_URL.length - 1);

    public static async fetchGlobal(url: string, method: Methods = 'GET', body?: RequestInit, withToken?: boolean) {
        withToken = (withToken != undefined) ? false : withToken;
        let res;
        let headers: any;
        let opts: RequestInit = {
            method: method
        };
        if (body) {
            opts.body = JSON.stringify(body);
            headers = {
                'Content-Type': 'application/json'
            }
        }
        if (withToken) {
            headers["Authorization"] = process.env.AUTH_TOKEN;
        }
        opts.headers = headers;
        try {
            res = await fetch(url, opts);
        } catch (err) {
            throw err;
        }
        let text = await res.text();
        let data = (text) ? JSON.parse(text) : text;
        if (data.error) {
            console.error(data.error.message);
            throw data;
        }
        return data;
    }

    public static async fetch(route: string, method: Methods = 'GET', body?: any) {
        if (route.charAt(0) != '/') {
            throw 'Invalid route. Must begin with /';
        }
        route = route.replace(FetchHelper.URL, '');
        const url = FetchHelper.URL + route;
        try {
            return await FetchHelper.fetchGlobal(url, method, body, true);
        } catch (err) {
            throw err;
        }
    }

    public static async fetchUser(uid: number) {
        let user: IUser;
        try {
            user = await this.fetch(`/users/${uid}`);
        } catch (err) {
            throw err;
        }
        return user;
    }

    public static async fetchAllUserSubjetcs(uid: number) {
        let user;
        try {
            user = await this.fetchUser(uid);
        } catch (err) {
            throw err;
        }
        return user.subjects;
    }

    public static async fetchUserSubject(uuid: number, sIndex: number) {
        let subject: IUserSubject;
        try {
            subject = await this.fetch(`/users/${uuid}/subjects/${sIndex}`);
        } catch (err) {
            throw err;
        }
        return subject;
    }

    public static async fetchAllSubjectGrades(uuid: number, sIndex: number) {
        let grades: IGrade[];
        try {
            grades = await this.fetch(`/users/${uuid}/subjects/${sIndex}/grades`);
        } catch (err) {
            throw err;
        }
        return grades;
    }

    public static async fetchSubjectGrade(uuid: number, sIndex: number, gIndex: number) {
        let grade: IGrade;
        try {
            grade = await this.fetch(`/users/${uuid}/subjects/${sIndex}/grades/${gIndex}`);
        } catch (err) {
            throw err;
        }
        return grade;
    }

    public static async fetchAllTeachers() {
        let teachers: ITeacher[];
        try {
            teachers = await this.fetch(`/teachers`);
        } catch (err) {
            throw err;
        }
        return teachers;
    }

    public static async fetchTeacher(uid: number) {
        let teacher: ITeacher;
        try {
            teacher = await this.fetch(`/teachers/${uid}`);
        } catch (err) {
            throw err;
        }
        return teacher;
    }

    public static async postUser(userData: Omit<IUser, 'uid'>) {
        try {
            await this.fetch(`/users`, 'POST', { user: userData });
        } catch (err) {
            throw err;
        }
    }

    public static async postUserSubject(uuid: number, usData: IUserSubject) {
        try {
            await this.fetch(`/users/${uuid}/subjects`, 'POST', { subject: usData });
        } catch (err) {
            throw err;
        }
    }

    public static async postSubjectGrade(uuid: number, sIndex: number, gradeData: IGrade) {
        try {
            await this.fetch(`/users/${uuid}/subjects/${sIndex}/grades`, 'POST', { grade: gradeData });
        } catch (err) {
            throw err;
        }
    }

    public static async patchUser(uid: number, data: Partial<Omit<IUser, 'uid'>>) {
        try {
            await this.fetch(`/users/${uid}`, 'PATCH', { user: data });
        } catch (err) {
            throw err;
        }
        return;
    }

    public static async patchUserSubject(uuid: number, sIndex: number, data: Partial<IUserSubject>) {
        try {
            await this.fetch(`/users/${uuid}/subjects/${sIndex}`, 'PATCH', { subject: data });
        } catch (err) {
            throw err;
        }
    }

    public static async patchSubjectGrade(uuid: number, sIndex: number, gIndex: number, data: Partial<IGrade>) {
        try {
            await this.fetch(`/users/${uuid}/subjects/${sIndex}/grades/${gIndex}`, 'PATCH', { grade: data });
        } catch (err) {
            throw err;
        }
    }

    public static async deleteUser(uid: number) {
        try {
            await this.fetch(`/users/${uid}`, 'DELETE');
        } catch (err) {
            throw err;
        }
    }

    public static async deleteUserSubject(uuid: number, sIndex: number) {
        try {
            await this.fetch(`/users/${uuid}/subjects/${sIndex}`, 'DELETE');
        } catch (err) {
            throw err;
        }
    }

    public static async deleteSubjectGrade(uuid: number, sIndex: number, gIndex: number) {
        try {
            await this.fetch(`/users/${uuid}/subjects/${sIndex}/grades/${gIndex}`, 'DELETE');
        } catch (err) {
            throw err;
        }
    }
}
