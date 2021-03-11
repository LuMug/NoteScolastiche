import Subject from '../components/subject/Subject';
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
        let d = date.getDay().toString();
        let m = date.getMonth().toString();
        let y = date.getFullYear().toString();
        d = (d.length == 1) ? `0${d}` : d;
        m = (m.length == 1) ? `0${m}` : m;
        y = (y.length == 1) ? `0${y}` : y;
        return `${d}${separator}${m}${separator}${y}`;
    }

    public static valueToString(grade: IGrade): string {
        let val = grade.value.toFixed(2);
        if (val.charAt(val.length - 2) == '0') {
            val = val.charAt(0);
        }
        if (val.charAt(val.length - 1) == '0') {
            val = val.substr(0, 3);
        }
        return val;
    }

    public static getAllGrades(subjects: IUserSubject[]) {
        let grades: number[] = [];
        subjects.forEach(s => {
            s.grades.forEach(g => { grades.push(g.value); });
        });
        console.log(grades);

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
        return grades.map(g => g.value);
    }

    public static getAllAvgs(subjects: IUserSubject[]) {
        let grades: number[] = [];
        subjects.forEach(s => {
            grades.push(Subject.getSubjectAvg(s));
        });
        return grades;
    }
}