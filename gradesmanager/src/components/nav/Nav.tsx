import Auth from '../../auth/Auth';
import { IRouteDescritor } from '../../@types';
import { Link, Redirect } from 'react-router-dom';
import './nav.css';

interface INavProps {

    routes: IRouteDescritor[];

    entries: string[];

    onEntryClick: (index: number, entry: string) => void;
}

const Nav: React.FunctionComponent<INavProps> = (props) => {
    return <div className="n-side-panel">
        <div className="n-side-panel-section n-side-panel-routes-section">
            {props.routes.map((r, i) => {
                return (
                    <Link
                        to={r.path}
                        className="n-ruote-wrapper"
                        key={i}
                        onClick={() => {
                            if (r.name === 'Logout') {
                                Auth.logout();
                            }
                        }}>
                        <p className={`n-route-el noselect n-route-el-${r.path.replace('/', '')}`}>{r.name}</p>
                    </Link>
                );
            })}
        </div>
        <div className="n-side-panel-separator"></div>
        <div className="n-side-panel-section n-side-panel-entries-section">
            <p className="n-side-panel-section-title noselect">Materie</p>
            {props.entries.map((e, i) => {
                <Redirect to={`/subjects/${i}`} />
                return (
                    <div className="n-subject-wrap"
                        key={i}
                        onClick={() => props.onEntryClick(i, e)}>
                        <p className="n-subject-el">{e}</p>
                    </div>
                );
            })}
        </div>
    </div>;
}

export default Nav;