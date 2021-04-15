import Auth from '../../auth/Auth';
import { Component, ReactNode } from 'react';
import { IRouteDescritor } from '../../@types';
import { Link, Redirect } from 'react-router-dom';
import './nav.css';

interface INavProps {

    routes: IRouteDescritor[];

    entries: string[];

    onEntryClick: (index: number, entry: string) => void;
}

class Nav extends Component<INavProps> {

    constructor(props: INavProps) {
        super(props);
    }

    render(): ReactNode {
        return <div className="n-side-panel">
            <div className="n-side-panel-section n-side-panel-routes-section">
                {this.props.routes.map((r, i) => {
                    return (
                        <Link
                            to={r.path}
                            className="n-ruote-wrapper"
                            key={i}
                            onClick={() => {
                                if (r.name == 'Logout') {
                                    Auth.logout();
                                }
                            }}>
                            <p className="n-route-el noselect">{r.name}</p>
                        </Link>
                    );
                })}
            </div>
            <div className="n-side-panel-separator"></div>
            <div className="n-side-panel-section n-side-panel-entries-section">
                <p className="n-side-panel-section-title noselect">Materie</p>
                {this.props.entries.map((e, i) => {
                    <Redirect to={`/subjects/${i}`} />
                    return (
                        <div className="n-subject-wrap"
                            key={i}
                            onClick={() => this.props.onEntryClick(i, e)}>
                            <p className="n-subject-el">{e}</p>
                        </div>
                    );
                })}
            </div>
        </div>;
    }
}

export default Nav;