import CircularFadeBorder from '../circular-fade-border/CircularFadeBorder';
import FetchHelper from '../../helpers/FetchHelper';
import Grade from './Grade';
import GradeHelper from '../../helpers/GradeHelper';
import { IGrade, ITeacher, IUserSubject } from '../../@types';
import { useEffect } from 'react';
import { useState } from 'react';
import './Subject.css';

interface ISubjectProps {

    subject: IUserSubject;

    onDelete: () => void;

    onAddGrade: () => void;

    onDetails: () => void;

    onRemoveGrade: (grade: IGrade, index: number) => void;

    onApply: (state: IUserSubject) => void;

    onTIBDisplay: () => void;
}

const Subject: React.FunctionComponent<ISubjectProps> = (props) => {
    const [name, setName] = useState<string>(props.subject.name);
    const [teacherName, setTeacherName] = useState<string>('');
    const [avg, setAvg] = useState<number>(1);
    const [isEditing, setIsEditing] = useState(false);
    const [grades, setGrades] = useState<IGrade[]>(props.subject.grades);

    const getAvg = (): number => {
        return getSubjectAvg(props.subject);
    }

    const setUp = async () => {
        let teacher: ITeacher | null = null;
        try {
            if (props.subject.teacherId !== undefined) {
                teacher = await FetchHelper.fetchTeacher(props.subject.teacherId);
            }
        } catch (err) {
            console.error(err);
            return;
        }
        if (teacher) {
            setTeacherName(`${teacher.surname} ${teacher.name}`);
        } else {
            setTeacherName(props.subject.teacherName);
        }
        setAvg(getAvg());
    }

    const onApply = async () => {
        let _name = name;
        let teacher = teacherName;
        let hasCustom = false;
        if (name.trim() === '') {
            // BAD harcoded loc string
            _name = 'Materia';
        }
        let teachers;
        try {
            teachers = await FetchHelper.fetchAllTeachers();
        } catch (err) {
            console.error(err);
            return;
        }
        let t = teachers.filter(t => {
            return `${t.surname} ${t.name}` === teacher
                || `${t.name} ${t.surname}` === teacher;
        });
        if (t.length >= 1) {
            teacher = `${t[0].surname} ${t[0].name}`;
            hasCustom = false;
        } else {
            hasCustom = true;
        }
        if (teacherName.trim() === '') {
            teacher = '?';
            hasCustom = true;
        }
        setIsEditing(false);
        setName(_name);
        setTeacherName(teacher);
        let subject = props.subject;
        subject.name = name;
        subject.teacherName = teacher;
        if (hasCustom) {
            delete subject.teacherId;
        }
        props.onApply(subject);
    }

    useEffect(() => {
        const fetch = async () => {
            await setUp();
        }
        fetch();
        setGrades(GradeHelper.getSortedByDate(props.subject.grades));
    }, []);

    useEffect(() => {
        setAvg(getAvg());
    }, [getSubjectAvg(props.subject)]);

    useEffect(() => {
        const fetch = async () => {
            await setUp();
        }
        fetch();
    }, [props.subject.teacherName]);

    useEffect(() => {
        if (!isEditing) {
            setName(props.subject.name);
        }
    }, [name, props.subject.name, isEditing]);

    useEffect(() => {
        // Sorting like this is super stupid and really resource intensive
        // but i am bad at react and can't detect when only grades change.
        // Add `grades` prop to `ISubjectProps` ???
        setGrades(GradeHelper.getSortedByDate(props.subject.grades));
    }, [props]);

    let sData;
    // let customTeacher = (!hasCustomTeacher)
    //     ? ''
    // : <div
    //     className="s-subject-teacher-warning noselect"
    //     onClick={() => props.onTIBDisplay()}
    // ></div>;
    let customTeacher = !isEditing
        ? <div
            className="s-subject-teacher-warning noselect"
            onClick={() => props.onTIBDisplay()}
        ></div>
        : null;
    if (grades.length !== 0) {
        sData = <div className="s-subject-data">
            <div className="s-subject-grades">
                {grades.map((g, i) => {
                    return <div className="s-subject-grade-wrapper" key={i}>
                        <div className="s-subject-grade-delete noselect" onClick={() => props.onRemoveGrade(g, props.subject.grades.indexOf(g))}></div>
                        <Grade key={i} gradeObj={g} editable={false} />
                    </div>;
                })}
            </div>
            <CircularFadeBorder>
                <p className={avg < 4 ? 'orange-text' : ''}>
                    {avg.toFixed(1)}
                </p>
            </CircularFadeBorder>
        </div>;
    }

    return (
        <div className="hp-card s-subject" >
            <div className="s-drag-handle-wrapper">
                <div className="s-drag-handle"
                    draggable="true"></div>
            </div>
            <div className="s-subject-top">
                <input
                    type="text"
                    className={`editable-p s-subject-title ${(isEditing) ? 's-input-editing' : ''}`}
                    value={name}
                    disabled={!isEditing}
                    onChange={e => setName(e.target.value)}
                />
                <div className="s-subject-teacher-wrapper">
                    <input
                        type="text"
                        className={`editable-p s-subject-teacher ${(isEditing) ? 's-input-editing' : ''}`}
                        value={teacherName}
                        disabled={!isEditing}
                        onChange={e => setTeacherName(e.target.value)}
                    />
                    {customTeacher}
                </div>
                <div className="s-edit-btn-wrapper">
                    <div className="s-edit-btn noselect"> </div>
                    <div className="s-edit-btn-content">
                        <div className="s-edit-btn-el s-edit-btn-el-edit noselect" onClick={() => setIsEditing(true)}> </div>
                        <div className="s-edit-btn-el s-edit-btn-el-details noselect" onClick={() => props.onDetails()}> </div>
                        <div className="s-edit-btn-el s-edit-btn-el-trash noselect" onClick={() => props.onDelete()}></div>
                    </div>
                </div>
            </div>
            <div className="s-subject-separator"></div>
            { sData}
            <div className={`${isEditing ? 's-subject-apply-wrapper noselect' : 's-subject-add-grade-wrapper noselect'}`}>
                <div
                    className={`${isEditing ? 's-subject-apply noselect' : 's-subject-add-grade noselect'}`}
                    onClick={() => {
                        if (isEditing) {
                            onApply();
                        } else {
                            props.onAddGrade();
                        }
                    }}
                >+</div>
            </div>
        </div >
    );
}

export default Subject;

export const getSubjectAvg = (subject: IUserSubject): number => {
    if (subject.grades.length == 0) {
        return 0;
    }
    let sum = subject.grades.map(g => g.value * g.weight).reduce((p, c) => p + c);
    let weightSum = subject.grades.map(g => g.weight).reduce((p, c) => p + c);
    return sum / Math.max(1, weightSum);
}
