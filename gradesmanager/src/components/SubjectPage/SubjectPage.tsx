import AddGradeButton from '../add-grade-btn/AddGradeButton';
import FetchHelper from '../../helpers/FetchHelper';
import GradeHelper from '../../helpers/GradeHelper';
import GradeOptions from '../grade-options/GradeOptions';
import GradePrompt from '../grade-prompt/GradePrompt';
import React, { Component, ReactNode } from 'react';
import Subject from '../subject/Subject';
import { IGrade, ITeacher, IUserSubject } from '../../@types';
import './subject-page.css';

interface ISubjectPageProps {

    subject: IUserSubject;

    onAbort: () => void;

    onAddGrade: (value: number, weight: number, date: Date) => void;

    onEditGrade?: (grade: IGrade, index: number) => void;

    onRemoveGrade: (grade: IGrade, index: number) => void;
}

interface ISubjectPageState {

    loading: boolean;

    subject: IUserSubject;

    teacher?: ITeacher;

    teacherFullname?: string;

    displayPrompt: boolean;
}

class SubjectPage extends Component<ISubjectPageProps, ISubjectPageState> {

    constructor(props: ISubjectPageProps) {
        super(props);
        this.state = {
            loading: true,
            subject: props.subject,
            displayPrompt: false
        };
    }

    async componentDidMount() {
        this.setUp();
    }

    componentDidUpdate(prevProps: ISubjectPageProps, prevState: ISubjectPageState) {
        if (this.props != prevProps) {
            this.setUp();
        }
    }

    private async setUp() {
        if (this.props.subject.teacherId) {
            let teacher: ITeacher;
            try {
                teacher = await FetchHelper.fetchTeacher(this.props.subject.teacherId);
            } catch (err) {
                console.error(err);
                return;
            }
            this.setState({
                loading: false,
                teacher: teacher,
                teacherFullname: `${teacher.surname} ${teacher.name}`,
                subject: this.props.subject
            });
            return;
        }
        this.setState({
            loading: false,
            teacherFullname: this.props.subject.teacherName,
            subject: this.props.subject
        });
    }

    render(): ReactNode {
        if (this.state.loading || !this.state.subject || (!this.state.teacher && !this.state.teacherFullname)) {
            return <h1>loading</h1>
        }
        let grades = this.state.subject.grades;
        let avg = Subject.getSubjectAvg(this.state.subject);
        let testPlural = (grades.length > 1) ? 's' : '';
        let gradePrompt =
            <div className={(this.state.displayPrompt) ? 'sp-prompt' : 'hidden'} >
                <GradePrompt
                    title={`${this.state.subject.name}`}
                    onAbort={() => {
                        this.setState({ displayPrompt: false });
                    }}
                    onSubmit={
                        (value, weight, date) => {
                            this.props.onAddGrade(value, weight, date);
                            // this.state.subject.grades.push({
                            //     date: date.toISOString(),
                            //     value: value,
                            //     weight: weight
                            // });
                        }
                    }
                />
            </div>;
        return (
            <div className="sp-main-content">
                <div className="sp-abort noselect" onClick={() => this.props.onAbort()}></div>
                <div className="sp-top">
                    <div className="sp-top-top">
                        <div className="sp-avg-wrapper">
                            <div className="sp-avg-border">
                                <div className="sp-avg">{(grades.length == 0) ? '' : avg.toFixed(1)}</div>
                            </div>
                        </div>
                        <div className="sp-subject-details">
                            <div className="sp-details-header">{this.state.subject.name}</div>
                            <div className="sp-details-teacher">{this.state.teacherFullname}</div>
                            <div className="sp-details-data">
                                <div className="sp-details-tests">
                                    <p><span>{grades.length}</span> test{testPlural}</p>
                                </div>
                                <div className="sp-details-avg">
                                    <p>Avg: <span className={(grades.length > 0) ? 'sp-details-avg-number' : ''}>{(grades.length == 0) ? '-' : avg.toFixed(2)}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sp-bottom">
                    <div className="sp-grades-table">
                        <table>
                            <tr className="sp-thead">
                                <th className="sp-th"><p>Grade</p></th>
                                <th className="sp-th"><p>Date</p></th>
                                <th className="sp-th"><p>Weight</p></th>
                                <th className="sp-th"><p>Options</p></th>
                            </tr>
                            {this.state.subject.grades.map((g, i) => {
                                return <tr className="sp-tr" key={i}>
                                    <td className="sp-td sp-grade">{GradeHelper.valueToString(g)}</td>
                                    <td className="sp-td">{GradeHelper.getDate(g)}</td>
                                    <td className="sp-td">{g.weight.toFixed(1)}</td>
                                    <td className="sp-td sp-options">
                                        <div className="sp-options-wrapper">
                                            <GradeOptions
                                                onOptionClick={(oi) => {
                                                    if (oi == 1) {
                                                        this.props.onRemoveGrade(g, i);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </td>
                                </tr>;
                            })}
                        </table>
                    </div>
                    <div className="sp-add-grade-wrapper">
                        <AddGradeButton onClick={() => {
                            this.setState({
                                displayPrompt: !this.state.displayPrompt
                            });
                        }} />
                    </div>
                </div>
                {gradePrompt}
            </div >
        );
    }
}

export default SubjectPage;
