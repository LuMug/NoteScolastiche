/**
 * The user group.
 * 
 * @author Nicola Ambrosetti
 * @version 2021.01.28
 */
export interface IGroup {

    /**
     * The group id.
     */
    uid: number;

    /**
     * The group name.
     */
    name: string;
}

/**
 * The subject.
 * 
 * @author Nicola Ambrosetti
 * @version 2021.01.28
 */
// export interface ISubject {

//     /**
//      * The subject id.
//      */
//     uid: number;

//     /**
//      * The subject name.
//      */
//     name: string;

//     /**
//      * The id of the teacher.
//      */
//     teacherId: number;
// }

/**
 * The teacher.
 * 
 * @author Nicola Ambrosetti
 * @version 2021.01.28
 */
export interface ITeacher {

    /**
     * The teacher id.
     */
    uid: number;

    /**
     * The teacher name.
     */
    name: string;

    /**
     * The teacher surname.
     */
    surname: string;

    /**
     * The ids of the subjects of the teacher.
     */
    subjectsIds: number[];

    /**
     * The ids of the groups of the teacher
     */
    groupsIds: number[];
}

/**
 * The grade.
 * 
 * @author Nicola Ambrosetti
 * @version 2021.02.04
 */
export interface IGrade {

    /**
     * The value.
     */
    value: number;

    /**
     * The date.
     */
    date: string;

    /**
     * The weight.
     */
    weight: number;
}

/**
 * The usersubject.
 * 
 * @author Nicola Ambrosetti
 * @version 2021.01.28
 */
export interface IUserSubject {

    /**
     * The id of the subject.
     */
    name: string;

    /**
     * The teacher name.
     */
    teacherName: string;

    /**
     * The teacher uid.
     */
    teacherId?: number;

    /**
     * All grades.
     */
    grades: IGrade[];
}

/**
 * The user types, it defines the user abilty to change data.
 * 
 * @author Nicola Ambrosetti
 * @version 2021.01.28
 */
export enum UserType {

    STUDENT = 'student',
    TEACHER = 'teacher',
    ADMIN = 'admin'
}

/**
 * The user.
 * 
 * @author Nicola Ambrosetti
 * @version 2021.01.28
 */
export interface IUser {

    /**
     * The user id.
     */
    uid: number;

    /**
     * The user name.
     */
    name: string;

    /**
     * The user surname.
     */
    surname: string;

    /**
     * The group id.
     */
    groupId: number;

    /**
     * All subjects.
     */
    subjects: IUserSubject[];

    /**
     * The type of user.
     */
    type: UserType;
}

export interface IError {

    message: string;
}

export interface IRouteDescritor {

    name: string;

    path: string;

    iconURL?: string;
}

export type Collections = 'users' | 'teachers' | 'groups';

export type CollectionTypes = IUser | ITeacher | IGroup;