import Grade from './Grade';
import React, { Component, ReactNode } from 'react';
import { API_URL } from '../../util/constants';
import { IGrade, ITeacher, IUserSubject } from '../../@types';
import { Redirect } from 'react-router-dom';
import './Subject.css';

interface ISubjectProps {

    subject: IUserSubject;

    onDelete: () => void;

    onEdit: () => void;
}

interface SubjectState {

    teacherName: string;

    avg: number;

    isEditing: boolean;
}

class Subject extends Component<ISubjectProps, SubjectState> {

    constructor(props: ISubjectProps) {
        super(props);
        let avg: number = 0;
        props.subject.grades.map((g: IGrade) => { avg += g.value; });
        avg /= Math.max(1, props.subject.grades.length);
        this.state = {
            avg: avg,
            teacherName: '',
            isEditing: false
        };
    }

    public async componentDidMount() {
        const url = `${API_URL}teachers/${this.props.subject.teacherId}`;
        const res = await fetch(url);
        const data = await res.json() as ITeacher;
        this.setState({
            teacherName: `${data.surname} ${data.name}`
        });
    }

    render(): ReactNode {
        let sData;
        if (this.props.subject.grades.length != 0) {
            sData = <div className="s-subject-data">
                <div className="s-subject-grades">
                    {this.props.subject.grades.map((g, i) => {
                        return <Grade key={i} gradeObj={g} editable={false} />
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
                        className="editable-p s-subject-title"
                        value={this.props.subject.name}
                        disabled
                    />
                    <input
                        type="text"
                        className="editable-p s-subject-teacher"
                        value={this.state.teacherName}
                        disabled
                    />
                    <div className="s-edit-btn-wrapper">
                        <div className="s-edit-btn noselect"> </div>
                        <div className="s-edit-btn-content">
                            <div className="s-edit-btn-el s-edit-btn-el-edit noselect" onClick={() => this.props.onEdit()}> </div>
                            <div className="s-edit-btn-el s-edit-btn-el-trash noselect" onClick={() => this.props.onDelete()}></div>
                        </div>
                    </div>
                </div>
                <div className="s-subject-separator"></div>
                {sData}
                <div className="s-subject-add-grade-wrapper noselect">
                    <div className="s-subject-add-grade">+</div>
                </div>
            </div>
        );
    }
}

export default Subject;