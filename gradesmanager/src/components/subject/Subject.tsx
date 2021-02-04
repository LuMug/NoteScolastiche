import { Component, ReactNode } from 'react';
import { IGrade, IUserSubject } from '../../@types';
import Grade from './Grade';
import './Subject.css';

interface ISubjectProps {

    name: string;
    teacherName: string;
    subjectObj: IUserSubject;
}

interface SubjectState {

    avg: number;
}

class Subject extends Component<ISubjectProps, SubjectState> {

    constructor(props: ISubjectProps) {
        super(props);
        let avg: number = 0;
        props.subjectObj.grades.map((g: IGrade) => { avg += g.value; });
        avg /= Math.max(1, props.subjectObj.grades.length);
        this.state = {
            avg: avg
        };
    }

    render(): ReactNode {
        return (
            <div className="card s-subject">
                <div className="s-subject-top">
                    <input
                        type="text"
                        className="editable-p s-subject-title"
                        value={this.props.name}
                        disabled
                    />
                    <input
                        type="text"
                        className="editable-p s-subject-teacher"
                        value={this.props.teacherName}
                        disabled
                    />
                </div>
                <div className="s-subject-separator"></div>
                <div className="s-subject-data">
                    <div className="s-subject-grades">
                        {this.props.subjectObj.grades.map((g: IGrade) => {
                            return <Grade gradeObj={g} editable={false} />
                        })}
                    </div>
                    <div className="s-subject-avg-wrapper">
                        <div className="s-subject-avg-border">
                            <div className="s-subject-avg">{this.state.avg.toFixed(1)}</div>
                        </div>
                    </div>
                </div>
                <div className="s-subject-add-grade-wrapper noselect">
                    <div className="s-subject-add-grade">+</div>
                </div>
            </div>
        );
    }
}

export default Subject;