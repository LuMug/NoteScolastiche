import FetchHelper from '../../helpers/FetchHelper';
import LoadingPage from '../LoadingPage/LoadingPage';
import Page from '../Page/Page';
import React, { useEffect, useState } from 'react';
import Slider from '../slider/Slider';
import WelcomeComponent from '../welcome-component/WelcomeComponent';
import {
  IGroup,
  ITeacher,
  IUser,
  IUserSubject,
  UserType
  } from '../../@types';
import './TeacherPage.css';

interface ITeacherPageProps {

  tuid: number;
}

const TeacherPage = (props: ITeacherPageProps) => {
  const [teacher, setTeacher] = useState<ITeacher | null>(null);
  const [mode, toggleMode] = useState(false);
  const [groups, setGroups] = useState<IGroup[] | null>(null);
  const [groupNames, setGroupNames] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<number[] | null>(null);
  const [students, setStudents] = useState<IUser[]>([]);
  const [currentCtx, setCurrentCtx] = useState<IGroup | number | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        let _teacher = await FetchHelper.fetchTeacher(props.tuid);
        let _groups = await FetchHelper.fetchGroupsFor(props.tuid);
        setTeacher(() => _teacher);
        setGroups(() => _groups);
        setSubjects(() => [0, 1, 2, 3, 4]);
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
        let sts = await FetchHelper.fetchGroupStudents(
          (typeof currentCtx == 'number')
            ? currentCtx
            : currentCtx.uid);
        setStudents(() => sts);
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

  if (!teacher || !groups && !subjects) {
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
          return (
            <tr className={cname} key={i} onClick={() => {
              setStudents(() => []);
              setCurrentCtx(() => g);
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

  let tableWrapper;
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
    } else if (students.length == 0 && currentCtx) {
      studentsBody = <tr className="tp-tr">
        <td className="tp-td-loading" colSpan={3} ></td>
      </tr>;
    }
    tableWrapper = <div className="tp-tables-wrapper">
      <div className="tp-left-table">{modeTableContent}</div>
      <div className="tp-right-table">
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
    tableWrapper = <div className="tp-tables-wrapper">
      <div className="tp-left-table">
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
        {tableWrapper}
      </div>
    </Page>
  );
};

export default TeacherPage;
