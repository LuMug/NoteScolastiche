import AddGradeButton from '../add-grade-btn/AddGradeButton';
import FetchHelper from '../../helpers/FetchHelper';
import Grade from './Grade';
import React, { Component, ReactNode } from 'react';
import TeacherInfobox from '../teacher-infobox/TeacherInfobox';
import { API_URL } from '../../util/constants';
import { IGrade, ITeacher, IUserSubject } from '../../@types';
import './Subject.css';

interface ISubjectProps {

    subject: IUserSubject;

    onDelete: () => void;

    onAddGrade: () => void;

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

class Subject extends Component<ISubjectProps, ISubjectState> {

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
        return Subject.getSubjectAvg(this.props.subject);
    }

    render(): ReactNode {
        let sData;
        let customTeacher = (!this.state.hasCustomTeacher)
            ? ''
            : <div
                className="s-subject-teacher-warning noselect"
                onClick={() => this.props.onTIBDisplay()}
            ></div>;
        if (this.props.subject.grades.length != 0) {
            sData = <div className="s-subject-data">
                <div className="s-subject-grades">
                    {this.props.subject.grades.map((g, i) => {
                        return <div className="s-subject-grade-wrapper" key={i}>
                            <div className="s-subject-grade-delete noselect" onClick={() => this.props.onRemoveGrade(g, i)}></div>
                            <Grade key={i} gradeObj={g} editable={false} />
                        </div>;
                    })}
                </div>
                <div className="s-subject-avg-wrapper">
                    <div className="s-subject-avg-border">
                        <div className="s-subject-avg">{this.state.avg.toFixed(1)}</div>
                    </div>
                </div>
            </div>;
        }
        return (
            <div className="hp-card s-subject">
                <div className="s-subject-top">
                    <input
                        type="text"
                        className={`editable-p s-subject-title ${(this.state.isEditing) ? 's-input-editing' : ''}`}
                        value={this.state.name}
                        disabled={!this.state.isEditing}
                        onChange={(e) => this.onChangeName(e.target.value)}
                    />
                    <div className="s-subject-teacher-wrapper">
                        <input
                            type="text"
                            className={`editable-p s-subject-teacher ${(this.state.isEditing) ? 's-input-editing' : ''}`}
                            value={this.state.teacherName}
                            disabled={!this.state.isEditing}
                            onChange={(e) => this.onChangeTeacher(e.target.value)}
                        />
                        {customTeacher}
                    </div>
                    <div className="s-edit-btn-wrapper">
                        <div className="s-edit-btn noselect"> </div>
                        <div className="s-edit-btn-content">
                            <div className="s-edit-btn-el s-edit-btn-el-edit noselect" onClick={() => this.onEdit()}> </div>
                            <div className="s-edit-btn-el s-edit-btn-el-trash noselect" onClick={() => this.props.onDelete()}></div>
                        </div>
                    </div>
                </div>
                <div className="s-subject-separator"></div>
                {sData}
                <div className={`${this.state.isEditing ? 's-subject-apply-wrapper noselect' : 's-subject-add-grade-wrapper noselect'}`}>
                    <div
                        className={`${this.state.isEditing ? 's-subject-apply noselect' : 's-subject-add-grade noselect'}`}
                        onClick={() => {
                            if (this.state.isEditing) {
                                this.onApply();
                            } else {
                                this.props.onAddGrade();
                            }
                        }}
                    >+</div>
                </div>
            </div>
        );
    }
}

export default Subject;