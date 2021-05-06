import React from 'react';
import SearchBar from '../search-bar/SearchBar';
import { ITeacher } from '../../@types';
import { useState } from 'react';
import './teacher-infobox.css';

interface ITeacherInfoboxProps {

    teachers: ITeacher[];

    onAbort: () => void;

    onTeacherClick: (teacher: ITeacher) => void;
}

const TeacherInfobox: React.FunctionComponent<ITeacherInfoboxProps> = (props) => {
    const [filtered] = useState<ITeacher[]>(props.teachers);
    const [query, setQuery] = useState<string>('');

    const onQueryChange = (text: string) => {
        setQuery(text.replace(' ', '').toLowerCase().trim());
    }

    const sortTeachers = (teachers: ITeacher[]) => {
        teachers.sort((a, b) => {
            let aName = `${a.surname} ${a.name}`;
            let bName = `${b.surname} ${b.name}`;
            return (aName > bName) ? 1 : (aName === bName) ? 0 : -1;
        });
    }

    let loading = (filtered.length !== 0) ? '' : <div className="tib-loading"><div></div></div>;
    let content;
    if (filtered.length !== 0) {
        let teachers: ITeacher[] = [];
        if (query) {
            filtered.forEach((v) => {
                let fullname = `${v.surname} ${v.name}`;
                let _fullname = `${v.name} ${v.surname}`
                fullname = fullname.replace(' ', '').toLowerCase().trim();
                _fullname = _fullname.replace(' ', '').toLowerCase().trim();
                if (fullname.includes(query) || _fullname.includes(query)) {
                    teachers.push(v);
                }
            });
            sortTeachers(teachers);
        } else {
            teachers = filtered
        }
        content = <div className="tib-teachers-wrapper">
            <div>
                {teachers.map((t, i) => {
                    return <div
                        className="tib-teacher"
                        key={i}
                        onClick={() => props.onTeacherClick(t)}
                    >{t.surname} {t.name}</div>;
                })}
            </div>
        </div>;
    } else {
        content = '';
    }
    return <div className="tib-main tib-slide-in">
        <div className="tib-abort noselect" onClick={() => props.onAbort()}></div>
        <div className="tib-head">Seleziona un docente dalla <span>lista della scuola</span></div>
        <SearchBar onChange={text => onQueryChange(text)} />
        {content}
        {loading}
    </div>
}
export default TeacherInfobox;