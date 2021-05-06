import _ENV from './../env.json';
import { API_URL } from '../util/constants';
import {
    IError,
    IGrade,
    IGroup,
    ITeacher,
    IUser,
    IUserSubject
    } from '../@types';

type Methods = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export default class FetchHelper {

    private static URL = API_URL.substr(0, API_URL.length - 1);

    public static async fetchGlobal(url: string, method: Methods = 'GET', body?: RequestInit, withToken?: boolean) {
        let useToken = withToken === undefined ? false : withToken;
        let res;
        let opts: RequestInit = {
            method: method
        };
        if (body) {
            opts.body = JSON.stringify(body);
            opts.headers = {
                'Content-Type': 'application/json'
            }
        }
        if (useToken) {
            if (_ENV.AUTH_TOKEN) {
                // blocks code ????
                // headers['authorization'] = _ENV.AUTH_TOKEN;
                opts.headers = {
                    'Content-Type': 'application/json',
                    'Authorization': _ENV.AUTH_TOKEN
                };
            } else {
                console.error('No Auth token detected. Cannot fetch API!');
            }
        }
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
        if (text.toLowerCase() === 'unauthorized') {
            console.error('Unauthorized');
            let err: IError = {
                error: {
                    message: 'Unauthorized'
                }
            }
            throw err;
        }
        return data;
    }

    public static async fetch(route: string, method: Methods = 'GET', body?: any) {
        if (route.charAt(0) !== '/') {
            let err: IError = {
                error: {
                    message: 'Invalid route. Must begin with /'
                }
            }
            throw err;
        }
        route = route.replace(FetchHelper.URL, '');
        const url = FetchHelper.URL + route;
        try {
            return await FetchHelper.fetchGlobal(url, method, body, true);
        } catch (err) {
            throw err;
        }
    }

    public static async login(username: string, password: string) {
        try {
            return await this.fetch('/authentication', 'POST', { username: username, password: password }) as IUser | null;
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

    public static async fetchAllUsers() {
        let users: IUser[];
        try {
            users = await this.fetch(`/users`);
        } catch (err) {
            throw err;
        }
        return users;
    }

    public static async fetchAllStudents() {
        let students: IUser[];
        try {
            students = await this.fetch(`/students`);
        } catch (err) {
            throw err;
        }
        // await this.delay(1000);
        return students;
    }

    // private static async delay(time: number) {
    //     return new Promise<void>((resolve, reject) => {
    //         setTimeout(() => resolve(), time);
    //     });
    // }

    public static async fetchTeacherStudents(teacher: ITeacher) {
        try {
            return (await this.fetchAllStudents()).filter(v => teacher.groupsIds.includes(v.groupId));
        } catch (err) {
            throw err;
        }
    }

    public static async fetchGroupStudents(groupUid: number) {
        try {
            return (await this.fetchAllStudents()).filter(v => v.groupId === groupUid);
        } catch (err) {
            throw err;
        }
    }

    public static async fetchUserUid(username: string) {
        let uid: number | null;
        let names = username.split('.');
        try {
            uid = await this.fetch(`/useruids/${names[0]}/${names[1]}`);
        } catch (err) {
            throw err;
        }
        if (uid) {
            return uid;
        }
        return uid;
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

    public static async fetchGroup(uid: number) {
        let group: IGroup;
        try {
            group = await this.fetch(`/groups/${uid}`);
        } catch (err) {
            throw err;
        }
        return group;
    }

    public static async fetchAllGroups() {
        let groups: IGroup[];
        try {
            groups = await this.fetch(`/groups`);
        } catch (err) {
            throw err;
        }
        return groups;
    }

    public static async fetchGroupsFor(teacherUid: number) {
        let teacher;
        try {
            teacher = await this.fetchTeacher(teacherUid);
        } catch (err) {
            throw err;
        }
        if (!teacher) {
            throw 'not a teacher';
        }
        let groups: IGroup[] = [];
        for (let i = 0; i < teacher.groupsIds.length; i++) {
            try {
                groups.push(
                    await this.fetchGroup(teacher.groupsIds[i])
                );
            } catch (err) {
                throw err;
            }
        }
        return groups;
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

    public static async patchSubjectGrade(uuid: number, sIndex: number, gIndex: number, data: IGrade) {
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
