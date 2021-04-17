import FetchHelper from '../../helpers/FetchHelper';
import Nav from '../nav/Nav';
import React, { Component, ReactNode } from 'react';
import { IUser, IUserSubject } from '../../@types';
import { ROUTES } from './../../util/constants';
import './page.css';

interface IPageProps {

    user: IUser | null;

    displayPrompt: boolean;

    promptElement?: JSX.Element;

    onListSubjectClick?: (us: IUserSubject, index: number) => void;
}

const Page: React.FunctionComponent<IPageProps> = (props) => {
    let prompt =
        <div className={`pa-prompt ${(props.displayPrompt) ? '' : 'hidden'}`}>
            {props.promptElement}
        </div>;
    return (
        <div className="pa-main-content">
            <Nav
                routes={ROUTES}
                entries={(props.user) ? props.user.subjects.map(s => s.name) : []}
                onEntryClick={(i) => {
                    if (props.onListSubjectClick && props.user) {
                        props.onListSubjectClick(props.user.subjects[i], i);
                    }
                }}
            />
            <div className="pa-content-page">
                {props.children}
            </div>
            {prompt}
        </div>
    )
}
export default Page;
