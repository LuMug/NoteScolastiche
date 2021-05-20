import Nav from '../nav/Nav';
import React from 'react';
import { IUser, IUserSubject } from '../../@types';
import { ROUTES } from './../../util/constants';
import './page.css';
import 'react-toastify/dist/ReactToastify.css';

interface IPageProps {

    user: IUser | null;

    displayPrompt: boolean;

    promptElement?: JSX.Element;

    passiveNav?: boolean;

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
                displayRedirect={props.passiveNav}
                onEntryClick={(i) => {
                    if (props.onListSubjectClick && props.user) {
                        props.onListSubjectClick(props.user.subjects[i], i);
                    }
                }}
            />
            <div className="pa-content-page">
                {props.children}
            </div>
            <div className={`pa-prompt-overlay${props.displayPrompt && props.promptElement ? '' : '-hidden'}`}></div>
            {prompt}
        </div>
    );
}
export default Page;
