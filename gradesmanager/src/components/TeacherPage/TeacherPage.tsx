import FetchHelper from '../../helpers/FetchHelper';
import LoadingPage from '../LoadingPage/LoadingPage';
import Page from '../Page/Page';
import Slider from '../slider/Slider';
import WelcomeComponent from '../welcome-component/WelcomeComponent';
import {
  IGroup,
  ITeacher,
  IUser,
  UserType
  } from '../../@types';
import { Redirect } from 'react-router';
import { useEffect, useState } from 'react';
import './TeacherPage.css';

interface ITeacherPageProps {

  tuid: number | null;
}

const TeacherPage = (props: ITeacherPageProps) => {
  const [teacher, setTeacher] = useState<ITeacher | null>(null);
  const [mode, toggleMode] = useState(false);
  const [groups, setGroups] = useState<IGroup[] | null>(null);
  const [groupNames, setGroupNames] = useState<string[]>([]);
  const [students, setStudents] = useState<IUser[]>([]);
  const [currentCtx, setCurrentCtx] = useState<IGroup | number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        let _teacher = await FetchHelper.fetchTeacher(props.tuid == null ? -1 : props.tuid);
        let _groups = await FetchHelper.fetchGroupsFor(props.tuid == null ? -1 : props.tuid);
        setTeacher(() => _teacher);
        setGroups(() => _groups);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
        return;
      }
    };
    fetch();
  }, [])

  useEffect(() => {
    if (!currentCtx) {
      return;
    }
    const fetch = async () => {
      try {
        setLoading(true);
        let sts = await FetchHelper.fetchGroupStudents(
          (typeof currentCtx == 'number')
            ? currentCtx
            : currentCtx.uid);
        setStudents(() => sts);
        setLoading(false);
      } catch (err) {
        console.error(err);
        return;
      }
    };
    fetch();
  }, [currentCtx])

  useEffect(() => {
    const fetch = async () => {
      if (mode && teacher) {
        try {
          let sts = await FetchHelper.fetchTeacherStudents(teacher);
          setStudents(() => sts);
        } catch (err) {
          console.error(err);
          return;
        }
      }
    }
    fetch();
  }, [mode]);

  useEffect(() => {
    const fetch = async () => {
      if (mode) {
        let names: string[] = []
        for (let i = 0; i < students.length; i++) {
          names.push((await FetchHelper.fetchGroup(students[i].groupId)).name);
        }
        setGroupNames(() => names);
      }
    }
    fetch();
  }, [students])

  if (!groups || !teacher) {
    return (
      <Page displayPrompt={false} user={null}>
        <LoadingPage />
      </Page>
    );
  }

  if (!teacher && !loading) {
    return <Redirect to="/" />
  }

  let modeTableContent;
  if (!mode && groups) {
    modeTableContent =
      <table className="tp-table">
        <tr className="tp-tr">
          <th className="tp-th">Classi</th>
        </tr>
        {groups.map((g, i) => {
          let cname = (g === currentCtx) ? 'tp-tr tp-tr-current' : 'tp-tr';
          return (
            <tr className={cname} key={i} onClick={() => {
              if (!currentCtx || (currentCtx as IGroup).uid !== g.uid) {
                setStudents(() => []);
                setCurrentCtx(() => g);
              }
            }}>
              <td className="tp-td">{g.name}</td>
            </tr>
          );
        })}
      </table>;
  }

  let teacherAsUser: IUser = {
    groupId: -1,
    name: teacher.name,
    subjects: [],
    surname: teacher.surname,
    type: UserType.TEACHER,
    uid: teacher.uid
  }

  let groupsTables;
  let studentsTable;

  if (!mode) {
    let studentsBody;
    if (students.length > 0) {
      studentsBody = students.map((s, i) => {
        return <tr className="tp-tr" key={i}>
          <td className="tp-td">{s.name}</td>
          <td className="tp-td">{s.surname}</td>
          <td className="tp-td">{s.uid}</td>
        </tr>;
      });
    } else {
      if (currentCtx && loading) {
        studentsBody = <tr className="tp-tr">
          <td className="tp-td tp-td-loading" colSpan={3}></td>
        </tr>;
      } else if (currentCtx && !loading) {
        studentsBody = <tr className="tp-tr">
          <td className="tp-td tp-td-nodata" colSpan={3}>Nessun allievo di questa classe si e' ancora registrato</td>
        </tr>;
      }
    }
    studentsTable = null;
    groupsTables = <div className="tp-tables-wrapper">
      <div className="tp-table-wrapper">{modeTableContent}</div>
      <div className="tp-table-wrapper">
        <table className="tp-table">
          <tr className="tp-tr">
            <th className="tp-th">Nome</th>
            <th className="tp-th">Cognome</th>
            <th className="tp-th">ID</th>
          </tr>
          {studentsBody}
        </table>
      </div>
    </div>;
  } else if (mode) {
    let studentsBody;
    if (students.length > 0) {
      studentsBody = students.map((s, i) => {
        return <tr className="tp-tr" key={i}>
          <td className="tp-td">{s.name}</td>
          <td className="tp-td">{s.surname}</td>
          <td className="tp-td">{groupNames[i]}</td>
          <td className="tp-td">{s.uid}</td>
        </tr>;
      });
    } else {
      studentsBody = <tr className="tp-tr">
        <td className="tp-td-loading" colSpan={4} ></td>
      </tr>;
    }
    groupsTables = null;
    studentsTable = <div className="tp-tables-wrapper">
      <div className="tp-table-wrapper">
        <table className="tp-table">
          <tr className="tp-tr">
            <th className="tp-th">Nome</th>
            <th className="tp-th">Cognome</th>
            <th className="tp-th">Classe</th>
            <th className="tp-th">ID</th>
          </tr>
          {studentsBody}
        </table>
      </div>
    </div>;
  }

  return (
    <Page displayPrompt={false} user={teacherAsUser}>
      <div className="tp-main-content" >
        <WelcomeComponent name={teacher.name} />
        <div className="tp-modes-wrapper">
          <p className="tp-mode">Classi</p>
          <div className="tp-slider">
            <Slider onChangeState={() => {
              setStudents(() => []);
              setCurrentCtx(() => null);
              toggleMode(ps => !ps);
            }} />
          </div>
          <p className="tp-mode">Studenti</p>
        </div>
        {groupsTables}
        {studentsTable}
      </div>
    </Page>
  );
};

export default TeacherPage;
