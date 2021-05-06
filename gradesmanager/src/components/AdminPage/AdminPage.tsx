import Auth from '../../auth/Auth';
import FetchHelper from '../../helpers/FetchHelper';
import HomePage from '../HomePage/HomePage';
import LoadingPage from '../LoadingPage/LoadingPage';
import Page from '../Page/Page';
import ParamSwitcher from './ParamSwitcher';
import React, { useEffect, useState } from 'react';
import WelcomeComponent from '../welcome-component/WelcomeComponent';
import { ITeacher, IUser, UserType } from '../../@types';
import { merge } from '../../helpers/ArrayHelper';
import './admin-page.css';

interface IAdminPageProps {
    uuid: number | null;
}

const AdminPage: React.FunctionComponent<IAdminPageProps> = (props) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<IUser | null>(null);
    const [users, setUsers] = useState<(IUser | ITeacher)[]>([]);
    const [filtered, setFiltered] = useState<(IUser | ITeacher)[]>([]);
    const [showTeachers, setShowTeachers] = useState(false);
    const [showStudents, setShowStudents] = useState(true);
    const [showAdmins, setShowAdmins] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                if (props.uuid !== null) {
                    let user = await FetchHelper.fetchUser(props.uuid);
                    let users = await FetchHelper.fetchAllUsers();
                    let teachers = await FetchHelper.fetchAllTeachers();
                    let withTeachers = merge<IUser, ITeacher>(users, teachers);
                    setUser(() => user);
                    setUsers(() => withTeachers);
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
        let allowed: UserType[] = [];
        if (showStudents) {
            allowed.push(UserType.STUDENT);
        }
        if (showTeachers) {
            allowed.push(UserType.TEACHER);
        }
        if (showAdmins) {
            allowed.push(UserType.ADMIN);
        }
        setFiltered(users.filter(u => {
            if ((u as IUser).type) {
                return allowed.includes((u as IUser).type);
            } else {
                return allowed.includes(UserType.TEACHER);
            }
        }));
    }, [showStudents, showTeachers, showAdmins, users]);

    if (loading || !user || !users) {
        return <Page
            displayPrompt={false}
            user={user}>
            <LoadingPage />
        </Page>
    }

    if (user.type !== UserType.ADMIN) {
        Auth.setUserType(UserType.STUDENT);
        return <HomePage uuid={props.uuid} />
    }

    return (
        <Page
            displayPrompt={false}
            user={user}>
            <div className="adp-main-content">
                <WelcomeComponent name={user.name} />
                <div className="adp-params-wrapper">
                    <div className="adp-param-wrapper">
                        <ParamSwitcher label="Docenti" defaultValue={showTeachers} onSwitch={() => setShowTeachers(ps => !ps)} />
                    </div>
                    <div className="adp-param-wrapper">
                        <ParamSwitcher label="Studenti" defaultValue={showStudents} onSwitch={() => setShowStudents(ps => !ps)} />
                    </div>
                    <div className="adp-param-wrapper">
                        <ParamSwitcher label="Admins" defaultValue={showAdmins} onSwitch={() => setShowAdmins(ps => !ps)} />
                    </div>
                </div>
                <div className="tp-table-wrapper">
                    <table className="tp-table">
                        <tr className="tp-tr">
                            <th className="tp-th">Nome</th>
                            <th className="tp-th">Cognome</th>
                            <th className="tp-th">Tipo</th>
                            <th className="tp-th">ID</th>
                            <th className="tp-th tp-th-op">Operazioni</th>
                        </tr>
                        {filtered.map((s, i) => {
                            return <tr className="tp-tr" key={i}>
                                <td className="tp-td">{s.name}</td>
                                <td className="tp-td">{s.surname}</td>
                                <td className="tp-td capitalize">{((s as IUser).type) ? (s as IUser).type : UserType.TEACHER}</td>
                                <td className="tp-td">{s.uid}</td>
                                <td className="tp-td tp-td-op">x</td>
                            </tr>;
                        })}
                    </table>
                </div>
            </div>
        </Page>
    );
}

export default AdminPage;