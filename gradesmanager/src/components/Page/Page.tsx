import Nav from '../nav/Nav';
import React, { useEffect, useState } from 'react';
import Toast from '../toast/Toast';
import { IUser, IUserSubject } from '../../@types';
import { ROUTES } from './../../util/constants';
import { toast } from 'react-toastify';
import './page.css';
import 'react-toastify/dist/ReactToastify.css';

interface IPageProps {

    user: IUser | null;

    displayPrompt: boolean;

    promptElement?: JSX.Element;

    onListSubjectClick?: (us: IUserSubject, index: number) => void;
}

const Page: React.FunctionComponent<IPageProps> = (props) => {
    let prompt = (props.displayPrompt && props.promptElement)
        ? <div className="pa-prompt">{props.promptElement}</div>
        : null;
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
            { props.displayPrompt && props.promptElement ? <div className="pa-prompt-overlay"></div> : null}
            {prompt}
        </div>
    );
}
export default Page;
