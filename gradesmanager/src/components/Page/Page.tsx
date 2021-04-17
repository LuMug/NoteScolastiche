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

class Page extends Component<IPageProps> {

    constructor(props: IPageProps) {
        super(props);
    }

    render(): ReactNode {
        let prompt =
            <div className={`pa-prompt ${(this.props.displayPrompt) ? '' : 'hidden'}`}>
                {this.props.promptElement}
            </div>;
        return (
            <div className="pa-main-content">
                <Nav
                    routes={ROUTES}
                    entries={(this.props.user) ? this.props.user.subjects.map(s => s.name) : []}
                    onEntryClick={(i) => {
                        if (this.props.onListSubjectClick && this.props.user) {
                            this.props.onListSubjectClick(this.props.user.subjects[i], i);
                        }
                    }}
                />
                <div className="pa-content-page">
                    {/* {this.props.content} */}
                    {this.props.children}
                </div>
                {prompt}
            </div>
        )
    }
}

export default Page;