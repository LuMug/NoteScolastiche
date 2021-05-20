import AbortX from '../abort-x/AbortX';
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

    onRemoveGrade?: (grade: IGrade, index: number) => void;
}

const SubjectPage: React.FunctionComponent<ISubjectPageProps> = (props) => {
    const [loading, setLoading] = useState(true);
    const [teacher, setTeacher] = useState<ITeacher | null>(null);
    const [teacherFullname, setTeacherFullname] = useState<string | null>(null);
    const [displayPrompt, setDisplayPrompt] = useState(false);
    const [prompt, setPrompt] = useState<JSX.Element>();
    const [grades, setGrades] = useState<IGrade[]>(props.subject.grades);

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

    const getColorClassName = (value: number): string => {
        if (value < 3.5) {
            return 'orange-text'; // red
        } else if (value < 4 && value >= 3.5) {
            return 'orange-text';
        }
        return '';
    }

    useEffect(() => {
        const fetch = async () => {
            await setUp();
        }
        fetch();
        setGrades(GradeHelper.getSortedByDate(props.subject.grades));
    }, []);

    useEffect(() => {
        const fetch = async () => {
            await setUp();
        }
        fetch();
    }, [props.subject]);

    useEffect(() => {
        setGrades(GradeHelper.getSortedByDate(props.subject.grades));
    }, [props]);

    if (loading || !props.subject || (!teacher && !teacherFullname)) {
        return <h1>loading</h1>
    }
    let avg = getSubjectAvg(props.subject);
    // BAD hardcoded loc string
    let testPlural = (grades.length > 1) ? 'he' : 'a';
    let gradePrompt = (displayPrompt)
        ? <div className="pa-prompt" >{prompt}</div>
        : null;
    return (
        <div className="sp-main-content">
            <div className="sp-abort noselect" onClick={() => props.onAbort()}>
                <AbortX />
            </div>
            <div className="sp-top">
                <div className="sp-top-top">
                    <div className="sp-avg-wrapper">
                        <CircularFadeBorder>
                            <p className={avg < 4 ? 'orange-text' : ''}>
                                {(grades.length == 0) ? '' : avg.toFixed(1)}
                            </p>
                        </CircularFadeBorder>
                    </div>
                    <div className="sp-subject-details">
                        <div className="sp-details-header">{props.subject.name}</div>
                        <div className="sp-details-teacher">{teacherFullname}</div>
                        <div className="sp-details-data">
                            <div className="sp-details-tests">
                                <p><span>{grades.length}</span> verific{testPlural}</p>
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
                        {grades.map((g, i) => {
                            return <tr className="sp-tr" key={i}>
                                <td className={`sp-td sp-grade ${getColorClassName(g.value)}`}>{GradeHelper.valueToString(g)}</td>
                                <td className="sp-td">{GradeHelper.getDate(g)}</td>
                                <td className="sp-td">{g.weight.toFixed(1)}</td>
                                <td className="sp-td sp-options">
                                    <div className="sp-options-wrapper">
                                        <GradeOptions
                                            onOptionClick={oi => {
                                                if (oi == 0) {
                                                    setPrompt(<GradePrompt
                                                        title={`Modifica: ${props.subject.name}`}
                                                        onAbort={() => {
                                                            setDisplayPrompt(false);
                                                        }}
                                                        onSubmit={(v, w, d) => {
                                                            setDisplayPrompt(false);
                                                            let newGrade: IGrade = {
                                                                value: v,
                                                                weight: w,
                                                                date: d.toISOString()
                                                            }
                                                            let index = props.subject.grades.indexOf(g);
                                                            return props.onEditGrade ? props.onEditGrade(newGrade, index) : null;
                                                        }}
                                                        value={g.value}
                                                        weight={g.weight}
                                                        date={new Date(g.date)}
                                                    />);
                                                    setDisplayPrompt(ps => !ps);
                                                } else if (oi == 1) {
                                                    let index = props.subject.grades.indexOf(g);
                                                    return props.onRemoveGrade ? props.onRemoveGrade(g, index) : null;
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
                        setPrompt(<GradePrompt
                            title={`${props.subject.name}`}
                            onAbort={() => {
                                setDisplayPrompt(false);
                            }}
                            onSubmit={
                                (value, weight, date) => {
                                    setDisplayPrompt(false);
                                    props.onAddGrade(value, weight, date);
                                }
                            }
                        />);
                        setDisplayPrompt(ps => !ps);
                    }} />
                </div>
            </div>
            <div className={`pa-prompt-overlay${displayPrompt ? '' : '-hidden'}`}></div>
            {gradePrompt}
        </div >
    );
}
export default SubjectPage;
