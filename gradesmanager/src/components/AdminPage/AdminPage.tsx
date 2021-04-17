import FetchHelper from '../../helpers/FetchHelper';
import LoadingPage from '../LoadingPage/LoadingPage';
import Page from '../Page/Page';
import ParamSwitcher from './ParamSwitcher';
import React, { useEffect, useState } from 'react';
import WelcomeComponent from '../welcome-component/WelcomeComponent';
import { IUser, UserType } from '../../@types';
import './admin-page.css';

interface IAdminPageProps {
    uuid: number | null;
}

const AdminPage: React.FunctionComponent<IAdminPageProps> = (props) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<IUser | null>(null);
    const [users, setUsers] = useState<IUser[] | null>(null);
    const [showTeachers, setShowTeachers] = useState(true);
    const [showStudents, setShowStudents] = useState(true);
    const [filtered, setFiltered] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                if (props.uuid !== null) {
                    let user = await FetchHelper.fetchUser(props.uuid);
                    let users = await FetchHelper.fetchAllUsers();
                    setUser(() => user);
                    setUsers(() => users);
                    setFiltered(() => {
                        return users.map((s, i) => {
                            return <tr className="tp-tr" key={i}>
                                <td className="tp-td">{s.name}</td>
                                <td className="tp-td">{s.surname}</td>
                                <td className="tp-td"></td>
                                <td className="tp-td capitalize">{s.type}</td>
                                <td className="tp-td">{s.uid}</td>
                            </tr>;
                        });
                    });
                    setLoading(() => false);
                }
            } catch (err) {
                console.error(err);
                return;
            }
        };
        fetch();
    }, []);

    useEffect(() => {
        if (!showStudents) {
            // DOES NOT WORK
            setFiltered(() =>
                filtered.filter(v => v.type != UserType.STUDENT)
            );
        }
        if (!showTeachers) {
            setFiltered(() =>
                filtered.filter(v => v.type != UserType.TEACHER)
            );
        }
    }, [showStudents, showTeachers]);

    if (loading || !user || !users) {
        return <Page
            displayPrompt={false}
            user={user}>
            <LoadingPage />
        </Page>
    }

    return (
        <Page
            displayPrompt={false}
            user={user}>
            <div className="adp-main-content">
                <WelcomeComponent name={user.name} />
                <div className="adp-params-wrapper">
                    <div className="adp-param-wrapper">
                        <ParamSwitcher label="Docenti" defaultValue={true} onSwitch={() => setShowTeachers(ps => !ps)} />
                    </div>
                    <div className="adp-param-wrapper">
                        <ParamSwitcher label="Studenti" defaultValue={true} onSwitch={() => setShowStudents(ps => !ps)} />
                    </div>
                </div>
                <div className="tp-tables-wrapper">
                    <div className="tp-left-table">
                        <table className="tp-table">
                            <tr className="tp-tr">
                                <th className="tp-th">Nome</th>
                                <th className="tp-th">Cognome</th>
                                <th className="tp-th">Classe</th>
                                <th className="tp-th">Tipo</th>
                                <th className="tp-th">ID</th>
                            </tr>
                            {filtered}
                        </table>
                    </div>
                </div>
            </div>
        </Page>
    );
}

export default AdminPage;