import FetchHelper from '../../helpers/FetchHelper';
import LoadingPage from '../LoadingPage/LoadingPage';
import Page from '../Page/Page';
import React, { useEffect, useState } from 'react';
import Slider from '../slider/Slider';
import WelcomeComponent from '../welcome-component/WelcomeComponent';
import { IGroup, IUser, IUserSubject } from '../../@types';
import './TeacherPage.css';

interface ITeacherPageProps {

  uuid: number;
}

const TeacherPage = (props: ITeacherPageProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [mode, toggleMode] = useState(false);
  const [groups, setGroups] = useState<IGroup[] | null>(null);
  const [subjects, setSubjects] = useState<number[] | null>(null);
  const [students, setStudents] = useState<IUser[]>([]);
  const [currentCtx, setCurrentCtx] = useState<IGroup | number | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setUser(await FetchHelper.fetchUser(props.uuid));
        setGroups(await FetchHelper.fetchGroupsFor(props.uuid));
        setSubjects([0, 1, 2, 3, 4]);
      } catch (err) {
        console.error(err);
        return;
      }
    };
    fetch();
  }, [])

  useEffect(() => {
    if (!currentCtx) {
      return
    }
    const fetch = async () => {
      try {
        setStudents(await FetchHelper.fetchAllStudentsFor((typeof currentCtx == 'number') ? currentCtx : currentCtx.uid));
      } catch (err) {
        console.error(err);
        return;
      }
    };
    fetch();
  }, [currentCtx])

  if (!user || !groups && !subjects) {
    return (
      <Page displayPrompt={false} user={null}>
        <LoadingPage />
      </Page>
    );
  }

  let modeTableContent;
  if (!mode && groups) {
    modeTableContent =
      <table className="tp-table">
        <tr className="tp-tr">
          <th className="tp-th">Classi</th>
        </tr>
        {groups.map((g, i) => {
          let cname = (g == currentCtx) ? 'tp-tr tp-tr-current' : 'tp-tr';
          console.log(cname == 'tp-tr tp-tr-current');
          return (
            <tr className={cname} key={i} onClick={() => {
              //if (currentCtx != g) {
              console.log('a');
              setCurrentCtx(g);
              //}
            }}>
              <td className="tp-td">{g.name}</td>
            </tr>
          );
        })}
      </table>;
  } else if (mode && subjects) {
    modeTableContent =
      <table className="tp-table">
        <tr className="tp-tr">
          <th className="tp-th">Materie</th>
        </tr>
        {/* {subjects.map((s, i) => {
          return (
            <tr className="tp-tr" key={i} onClick={() => setCurrentCtx(s)}>
              <td className="tp-td">{s}</td>
            </tr>
          );
        })} */}
        <tr className="tp-tr">
          <td className="tp-td">Coming soon!</td>
        </tr>
      </table>;
  }

  return (
    <Page displayPrompt={false} user={user}>
      <div className="tp-main-content" >
        <WelcomeComponent name={user.name} />
        <div className="tp-modes-wrapper">
          <p className="tp-mode">Classi</p>
          <div className="tp-slider">
            <Slider onChangeState={() => {
              setStudents([]);
              setCurrentCtx(null);
              toggleMode(ps => !ps);
            }} />
          </div>
          <p className="tp-mode">Materie</p>
        </div>
        <div className="tp-tables-wrapper">
          <div className="tp-left-table">{modeTableContent}</div>
          <div className="tp-right-table">
            <table className="tp-table">
              <tr className="tp-tr">
                <th className="tp-th">Nome</th>
                <th className="tp-th">Cognome</th>
                <th className="tp-th">ID</th>
              </tr>
              {students.map((s, i) => {
                return <tr className="tp-tr" key={i}>
                  <td className="tp-td">{s.name}</td>
                  <td className="tp-td">{s.surname}</td>
                  <td className="tp-td">{s.uid}</td>
                </tr>;
              })}
            </table>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default TeacherPage;
