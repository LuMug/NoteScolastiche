import React, { Component, ReactNode } from 'react';
import { API_URL } from './../../util/constants';
import { IGrade, ITeacher, IUserSubject } from '../../@types';
import { RouteComponentProps } from 'react-router-dom';
import './subject-page.css';

type SubjectPageProps = {
    uuid: number,
    suid: number
};

//interface ISubjectPageProps extends RouteComponentProps<SubjectPageProps> { }

interface ISubjectPageState {

    loading: boolean;
    subject: IUserSubject | null;
    teacher: ITeacher | null;
    prevState?: ISubjectPageState;
}

class SubjectPage extends Component<SubjectPageProps, ISubjectPageState> {

    constructor(props: SubjectPageProps) {
        super(props);
        this.state = {
            loading: true,
            subject: null,
            teacher: null
        };
    }

    async componentDidMount() {
        let uuid = this.props.uuid;//parseInt(this.props.uuid);
        let suid = this.props.suid;//parseInt(this.props.suid);
        //suid = 1;
        if (isNaN(uuid)) {
            console.error('Invalid uuid for subject detail');
            return;
        } else if (isNaN(suid)) {
            console.error('Invalid suid for subject detail');
            return;
        }
        let url = `${API_URL}users/${uuid}/subjects/${suid}`;
        let res = await fetch(url);
        const subject: IUserSubject = await res.json();
        url = `${API_URL}teachers/${subject.teacherId}`;
        res = await fetch(url);
        const teacher: ITeacher = await res.json();
        this.setState({
            loading: false,
            subject: subject,
            teacher: teacher,
            prevState: this.state
        });
    }

    render(): ReactNode {
        if (this.state.loading || !this.state.subject || !this.state.teacher) {
            return <h1>loading</h1>
        }
        let grades = this.state.subject.grades;
        let testPlural = (grades.length > 1) ? 's' : '';
        let avg: number = 0;
        grades.forEach(g => avg += g.value);
        avg /= Math.max(grades.length, 1);
        return (
            <div className="sp-page">
                <div className="main-content">
                    <div className="top">
                        <div className="top-top">
                            <div className="avg-wrapper">
                                <div className="avg-border">
                                    <div className="avg">{(grades.length == 0) ? '' : avg.toFixed(1)}</div>
                                </div>
                            </div>
                            <div className="subject-details">
                                <div className="details-header">{this.state.subject.name}</div>
                                <div className="details-teacher">{`${this.state.teacher.surname} ${this.state.teacher.name}`}</div>
                                <div className="details-data">
                                    <div className="details-tests">
                                        <p><span>{grades.length}</span> test{testPlural}</p>
                                    </div>
                                    <div className="details-avg">
                                        <p>Avg: <span>{(grades.length == 0) ? '-' : avg.toFixed(2)}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="top-bottom">
                            <div className="add-btn"></div>
                            <div className="options-btn">•••</div>
                        </div>
                    </div>
                    <div className="bottom">
                        <div className="searchbar">Filtra</div>
                        <div className="grades-table">
                            <table>
                                <tr>
                                    <th>Grade</th>
                                    <th>Date</th>
                                    <th>Weight</th>
                                    <th>Options</th>
                                </tr>
                                {grades.map((g, i) => {
                                    return (
                                        <tr key={i}>
                                            <td className="grade">{g.value}</td>
                                            <td>{g.date}</td>
                                            <td>{g.weight}</td>
                                            <td className="options-icon"></td>
                                        </tr>
                                    );
                                })}
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SubjectPage;
