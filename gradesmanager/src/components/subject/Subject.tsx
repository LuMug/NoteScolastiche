import CircularFadeBorder from '../circular-fade-border/CircularFadeBorder';
import FetchHelper from '../../helpers/FetchHelper';
import Grade from './Grade';
import { Component, ReactNode, useEffect } from 'react';
import { IGrade, ITeacher, IUserSubject } from '../../@types';
import { useState } from 'react';
import './Subject.css';



class _Subject extends Component<ISubjectProps, ISubjectState> {

    constructor(props: ISubjectProps) {
        super(props);
        this.state = {
            name: props.subject.name,
            avg: this.getAvg(),
            teacherName: '',
            isEditing: false,
            hasCustomTeacher: false
        };
    }

    async componentDidMount() {
        await this.setUp();
    }

    async componentDidUpdate(prevProps: ISubjectProps, prevState: ISubjectState) {
        if (prevState.name != this.props.subject.name && !this.state.isEditing) {
            this.setState({
                name: this.props.subject.name
            });
        }
        if (this.getAvg() != this.state.avg) {
            this.setState({
                avg: this.getAvg()
            });
        }
        if (prevProps.subject.teacherName != this.props.subject.teacherName) {
            await this.setUp();
        }
    }

    private async setUp() {
        let teacher: ITeacher | null = null;
        try {
            if (this.props.subject.teacherId != undefined) {
                teacher = await FetchHelper.fetchTeacher(this.props.subject.teacherId);
            }
        } catch (err) {
            // console.error(err);
            return;
        }
        if (teacher) {
            this.setState({
                teacherName: `${teacher.surname} ${teacher.name}`,
                hasCustomTeacher: false,
                name: this.props.subject.name
            });
        } else {
            this.setState({
                teacherName: this.props.subject.teacherName,
                hasCustomTeacher: true,
                name: this.props.subject.name
            });
        }
    }

    private onEdit() {
        this.setState({
            isEditing: true
        });
    }

    private async onApply() {
        // SE IL NOME E" REGISTRATO NON ACCETTERA" PIU" NUOVI NOMI
        let name = this.state.name;
        let teacher = this.state.teacherName;
        let hasCustom = false;
        if (this.state.name.trim() == '') {
            name = 'Subject';
        }
        let teachers = await FetchHelper.fetchAllTeachers();
        let t = teachers.filter((t) => {
            return `${t.surname} ${t.name}` == teacher
                || `${t.name} ${t.surname}` == teacher;
        });
        if (t.length >= 1) {
            teacher = `${t[0].surname} ${t[0].name}`;
        } else {
            hasCustom = true;
        }
        if (this.state.teacherName.trim() == '') {
            teacher = '?';
        }
        this.setState({
            isEditing: false,
            name: name,
            teacherName: teacher,
            hasCustomTeacher: hasCustom
        });
        let subject = this.props.subject;
        subject.name = name;
        subject.teacherName = teacher;
        this.props.onApply(subject);
    }

    private onChangeName(name: string) {
        this.setState({
            name: name
        });
    }

    private async onChangeTeacher(name: string) {
        this.setState({
            teacherName: name
        });
    }

    public static getSubjectAvg(subject: IUserSubject): number {
        let avg = 0;
        for (let g of subject.grades) {
            avg += g.value * g.weight;
        }
        return avg / Math.max(1, subject.grades.length);
    }

    public getAvg(): number {
        // return Subject.getSubjectAvg(this.props.subject);
        return 6
    }

}

interface ISubjectProps {

    subject: IUserSubject;

    onDelete: () => void;

    onAddGrade: () => void;

    onDetails: () => void;

    onRemoveGrade: (grade: IGrade, index: number) => void;

    onApply: (state: IUserSubject) => void;

    onTIBDisplay: () => void;
}

interface ISubjectState {

    name: string;

    teacherName: string;

    avg: number;

    isEditing: boolean;

    hasCustomTeacher: boolean;
}

const Subject: React.FunctionComponent<ISubjectProps> = (props) => {
    const [name, setName] = useState<string>(props.subject.name);
    const [teacherName, setTeacherName] = useState<string>('');
    const [avg, setAvg] = useState<number>(1);
    const [isEditing, setIsEditing] = useState(false);
    const [hasCustomTeacher, setHasCustomTeacher] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            await setUp();
        }
        fetch();
    }, []);

    useEffect(() => {
        setAvg(getAvg());
    }, [getSubjectAvg(props.subject)])

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
    }, [name, props.subject.name])

    const getAvg = (): number => {
        return getSubjectAvg(props.subject);
    }

    const setUp = async () => {
        let teacher: ITeacher | null = null;
        try {
            if (props.subject.teacherId != undefined) {
                teacher = await FetchHelper.fetchTeacher(props.subject.teacherId);
            }
        } catch (err) {
            console.error(err);
            return;
        }
        if (teacher) {
            setTeacherName(`${teacher.surname} ${teacher.name}`);
            setHasCustomTeacher(false);
        } else {
            setTeacherName(props.subject.teacherName);
            setHasCustomTeacher(true);
        }
        setAvg(getAvg());
    }

    const onApply = async () => {
        // SE IL NOME E" REGISTRATO NON ACCETTERA" PIU" NUOVI NOMI
        let _name = name;
        let teacher = teacherName;
        let hasCustom = false;
        if (name.trim() == '') {
            _name = 'Subject';
        }
        let teachers;
        try {
            teachers = await FetchHelper.fetchAllTeachers();
        } catch (err) {
            console.error(err);
            return;
        }
        let t = teachers.filter((t) => {
            return `${t.surname} ${t.name}` == teacher
                || `${t.name} ${t.surname}` == teacher;
        });
        if (t.length >= 1) {
            teacher = `${t[0].surname} ${t[0].name}`;
        } else {
            hasCustom = true;
        }
        if (teacherName.trim() == '') {
            teacher = '?';
        }
        setIsEditing(false);
        setName(_name);
        setTeacherName(teacher);
        setHasCustomTeacher(hasCustom);
        let subject = props.subject;
        subject.name = name;
        subject.teacherName = teacher;
        props.onApply(subject);
    }

    let sData;
    let customTeacher = (!hasCustomTeacher)
        ? ''
        : <div
            className="s-subject-teacher-warning noselect"
            onClick={() => props.onTIBDisplay()}
        ></div>;
    if (props.subject.grades.length != 0) {
        sData = <div className="s-subject-data">
            <div className="s-subject-grades">
                {props.subject.grades.map((g, i) => {
                    return <div className="s-subject-grade-wrapper" key={i}>
                        <div className="s-subject-grade-delete noselect" onClick={() => props.onRemoveGrade(g, i)}></div>
                        <Grade key={i} gradeObj={g} editable={false} />
                    </div>;
                })}
            </div>
            <CircularFadeBorder>
                {avg.toFixed(1)}
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
    let avg = 0;
    for (let g of subject.grades) {
        avg += g.value * g.weight;
    }
    return avg / Math.max(1, subject.grades.length);
}
