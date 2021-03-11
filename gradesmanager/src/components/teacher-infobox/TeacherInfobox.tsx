import FetchHelper from '../../helpers/FetchHelper';
import React, { Component, ReactNode } from 'react';
import SimpleTextInput from '../simple-text-input/SimpleTextInput';
import { ITeacher } from '../../@types';
import './teacher-infobox.css';

interface ITeacherInfoboxProps {

    teachers: ITeacher[];

    onAbort: () => void;

    onTeacherClick: (teacher: ITeacher) => void;
}

interface ITeacherInfoboxState {

    teachers: ITeacher[];

    query?: string;
}

class TeacherInfobox extends Component<ITeacherInfoboxProps, ITeacherInfoboxState> {

    constructor(props: ITeacherInfoboxProps) {
        super(props);
        this.sortTeachers(props.teachers);
        this.state = {
            teachers: props.teachers
        };
    }

    private sortTeachers(teachers: ITeacher[]) {
        teachers.sort((a, b) => {
            let aName = `${a.surname} ${a.name}`;
            let bName = `${b.surname} ${b.name}`;
            return (aName > bName) ? 1 : (aName == bName) ? 0 : -1;
        });
    }

    private onQueryChange(value: string) {
        this.setState({
            query: value
        });
    }

    render(): ReactNode {
        let loading = (this.state.teachers.length != 0) ? '' : <div className="tib-loading"><div></div></div>;
        let content;
        if (this.state.teachers.length != 0) {
            let teachers: ITeacher[] = [];
            if (this.state.query) {
                let query = this.state.query.replace(' ', '').toLowerCase().trim();
                this.state.teachers.forEach((v) => {
                    let fullname = `${v.surname} ${v.name}`;
                    let _fullname = `${v.name} ${v.surname}`
                    fullname = fullname.replace(' ', '').toLowerCase().trim();
                    _fullname = _fullname.replace(' ', '').toLowerCase().trim();
                    if (fullname.includes(query) || _fullname.includes(query)) {
                        teachers.push(v);
                    }
                });
                this.sortTeachers(teachers);
            } else {
                teachers = this.state.teachers;
            }
            content = <div className="tib-teachers-wrapper">
                <div>
                    {teachers.map((t, i) => {
                        return <div
                            className="tib-teacher"
                            key={i}
                            onClick={() => this.props.onTeacherClick(t)}
                        >{t.surname} {t.name}</div>;
                    })}
                </div>
            </div>;
        } else {
            content = '';
        }
        return <div className="tib-main tib-slide-in">
            <div className="tib-abort noselect" onClick={() => this.props.onAbort()}></div>
            <div className="tib-head">Ci sembra che questo docente non e' registrato nella sede. <span>Non preoccuparti!</span> Qui sotto pui trovare tutti quelli registrati:</div>
            <input
                type="text"
                className="tib-input"
                onChange={(e) => this.onQueryChange(e.target.value)}
                placeholder="Cerca" />
            {content}
            {loading}
        </div>
    }
}

export default TeacherInfobox;