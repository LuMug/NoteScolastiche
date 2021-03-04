import React, { Component, ReactNode } from 'react';
import { IRouteDescritor } from '../../@types';
import { Redirect } from 'react-router-dom';
import './nav.css';

interface INavProps {

    routes: IRouteDescritor[];

    entries: string[];

    onEntryClick: (index: number, entry: string) => void;
}

class Nav extends Component<INavProps> {
    constructor(props: INavProps) {
        super(props)

        this.state = {

        }
    }

    render(): ReactNode {
        return <div className="n-side-panel">
            <div className="n-side-panel-section n-side-panel-routes-section">
                {this.props.routes.map((r, i) => {
                    <Redirect to={r.path} />
                    return <div className="n-ruote-wrapper" key={i}>
                        <p className="n-route-el noselect">{r.name}</p>
                    </div>;
                })}
            </div>
            <div className="n-side-panel-separator"></div>
            <div className="n-side-panel-section n-side-panel-entries-section">
                <p className="n-side-panel-section-title noselect">Materie</p>
                {this.props.entries.map((e, i) => {
                    <Redirect to={`/subjects/${i}`} />
                    return <div className="n-subject-wrap" key={i} onClick={() => this.props.onEntryClick(i, e)}>
                        <p className="n-subject-el">{e}</p>
                    </div>
                })}
            </div>
        </div>;
    }
}

export default Nav;