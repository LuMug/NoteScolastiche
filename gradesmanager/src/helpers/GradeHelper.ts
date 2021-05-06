import { getSubjectAvg } from '../components/subject/Subject';
import { IGrade, IUserSubject } from '../@types';

export default class GradeHelper {

    public static getDate(grade: IGrade, separator?: string): string {
        let date = new Date(grade.date);
        if (!date) {
            return 'invalid date format';
        }
        if (!separator) {
            separator = '.';
        }
        let d = date.getDate().toString();
        let m = (date.getMonth() + 1).toString();
        let y = date.getFullYear().toString();
        d = (d.length === 1) ? `0${d}` : d;
        m = (m.length === 1) ? `0${m}` : m;
        y = (y.length === 1) ? `0${y}` : y;
        return `${d}${separator}${m}${separator}${y}`;
    }

    public static valueToString(grade: IGrade | number): string {
        let val;
        if (typeof grade == 'number') {
            val = grade.toFixed(2);
        } else {
            val = grade.value.toFixed(2);
        }
        if (val.charAt(val.length - 2) === '0') {
            val = val.charAt(0);
        }
        if (val.charAt(val.length - 1) === '0') {
            val = val.substr(0, 3);
        }
        return val;
    }

    public static getAllGrades(subjects: IUserSubject[]) {
        let grades: number[] = [];
        subjects.forEach(s => {
            s.grades.forEach(g => { grades.push(g.value); });
        });
        return grades;
    }

    public static getAllGradesByDate(subjects: IUserSubject[]) {
        let grades: IGrade[] = [];
        subjects.forEach(s => {
            grades.push(...s.grades);
        });
        grades.sort((a, b) => {
            return (a.date > b.date)
                ? 1
                : (a.date < b.date)
                    ? -1
                    : 0
        });
        return grades;
    }

    public static getAllGradesByDateWithSubject(subjects: IUserSubject[]) {
        type GradeWithName = {
            grade: IGrade,
            name: string
        };
        let withName: GradeWithName[] = [];
        subjects.forEach(s => {
            let gwns: GradeWithName[] = s.grades.map(g => {
                return {
                    grade: g,
                    name: s.name
                }
            });
            withName.push(...gwns);
        });
        withName.sort((a, b) => {
            return (a.grade.date > b.grade.date)
                ? 1
                : (a.grade.date < b.grade.date)
                    ? -1
                    : 0
        });
        return withName;
    }

    public static getAllGradesValuesByDate(subjects: IUserSubject[]) {
        return GradeHelper.getAllGradesByDate(subjects).map(g => g.value);
    }

    public static getAllAvgs(subjects: IUserSubject[]) {
        let grades: number[] = [];
        subjects.forEach(s => {
            grades.push(getSubjectAvg(s));
        });
        return grades;
    }

    public static getTotalAvg(subjects: IUserSubject[]) {
        let grades = GradeHelper.getAllGradesByDate(subjects);
        if (grades.length === 0) {
            return 0;
        }
        let weightsSum = Math.max(grades.map(g => g.weight).reduce((p, c) => p + c), 1);
        return grades.map(g => g.value * g.weight).reduce((p, c) => p + c) / weightsSum;
    }
}