import AddGradeButton from '../add-grade-btn/AddGradeButton';
import CircularFadeBorder from '../circular-fade-border/CircularFadeBorder';
import FetchHelper from '../../helpers/FetchHelper';
import GradeHelper from '../../helpers/GradeHelper';
import GradeOptions from '../grade-options/GradeOptions';
import GradePrompt from '../grade-prompt/GradePrompt';
import React, { useEffect } from 'react';
import Subject, { getSubjectAvg } from '../subject/Subject';
import { IGrade, ITeacher, IUserSubject } from '../../@types';
import { useState } from 'react';
import './subject-page.css';


interface ISubjectPageProps {

    subject: IUserSubject;

    onAbort: () => void;

    onAddGrade: (value: number, weight: number, date: Date) => void;

    onEditGrade?: (grade: IGrade, index: number) => void;

    onRemoveGrade: (grade: IGrade, index: number) => void;
}

const SubjectPage: React.FunctionComponent<ISubjectPageProps> = (props) => {
    const [loading, setLoading] = useState(true);
    const [teacher, setTeacher] = useState<ITeacher | null>(null);
    const [teacherFullname, setTeacherFullname] = useState<string | null>(null);
    const [displayPrompt, setDisplayPrompt] = useState(false);

    const setUp = async () => {
        if (props.subject.teacherId) {
            let tt: ITeacher;
            try {
                tt = await FetchHelper.fetchTeacher(props.subject.teacherId);
            } catch (err) {
                console.error(err);
                return;
            }
            setLoading(false);
            setTeacher(tt);
            setTeacherFullname(`${tt.surname} ${tt.name}`);
            return;
        }
        setLoading(false);
        setTeacherFullname(props.subject.teacherName);
    }

    useEffect(() => {
        const fetch = async () => {
            await setUp();
        }
        fetch();
    }, []);

    useEffect(() => {
        const fetch = async () => {
            await setUp();
        }
        fetch();
    }, [props.subject]);

    if (loading || !props.subject || (!teacher && !teacherFullname)) {
        return <h1>loading</h1>
    }
    let grades = props.subject.grades;
    let avg = getSubjectAvg(props.subject);
    let testPlural = (grades.length > 1) ? 's' : '';
    let gradePrompt =
        <div className={(displayPrompt) ? 'sp-prompt' : 'hidden'} >
            <GradePrompt
                title={`${props.subject.name}`}
                onAbort={() => {
                    setDisplayPrompt(false);
                }}
                onSubmit={
                    (value, weight, date) => {
                        props.onAddGrade(value, weight, date);
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
            <div className="sp-abort noselect" onClick={() => props.onAbort()}></div>
            <div className="sp-top">
                <div className="sp-top-top">
                    <div className="sp-avg-wrapper">
                        <CircularFadeBorder>
                            {(grades.length == 0) ? '' : avg.toFixed(1)}
                        </CircularFadeBorder>
                    </div>
                    <div className="sp-subject-details">
                        <div className="sp-details-header">{props.subject.name}</div>
                        <div className="sp-details-teacher">{teacherFullname}</div>
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
                        {props.subject.grades.map((g, i) => {
                            return <tr className="sp-tr" key={i}>
                                <td className="sp-td sp-grade">{GradeHelper.valueToString(g)}</td>
                                <td className="sp-td">{GradeHelper.getDate(g)}</td>
                                <td className="sp-td">{g.weight.toFixed(1)}</td>
                                <td className="sp-td sp-options">
                                    <div className="sp-options-wrapper">
                                        <GradeOptions
                                            onOptionClick={(oi) => {
                                                if (oi == 1) {
                                                    props.onRemoveGrade(g, i);
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
                        setDisplayPrompt(ps => !ps);
                    }} />
                </div>
            </div>
            {gradePrompt}
        </div >
    );
}
export default SubjectPage;
