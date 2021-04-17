import AddSubject from '../add-subject/AddSubject';
import AvgChart from '../avg-chart/AvgChart';
import FetchHelper from '../../helpers/FetchHelper';
import GradeHelper from '../../helpers/GradeHelper';
import GradePrompt from '../grade-prompt/GradePrompt';
import LoadingPage from '../LoadingPage/LoadingPage';
import Page from '../Page/Page';
import React, { useEffect, useState } from 'react';
import SearchBar from '../search-bar/SearchBar';
import Subject from '../subject/Subject';
import SubjectPage from '../SubjectPage/SubjectPage';
import TeacherInfobox from '../teacher-infobox/TeacherInfobox';
import TrendChart from '../trend-chart/TrendChart';
import WelcomeComponent from '../welcome-component/WelcomeComponent';
import {
  IGrade,
  ITeacher,
  IUser,
  IUserSubject
  } from '../../@types';
import './home-page.css';

interface IHomePageProps {

  uuid: number | null;
}

const HomePage: React.FunctionComponent<IHomePageProps> = (props) => {
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [displayDetails, setDisplayDetails] = useState(false);
  const [displayGradePrompt, setDisplayGradePrompt] = useState(false);
  const [displayTIB, setDisplayTIB] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<IUserSubject | null>(null);
  const [teachersCache, setTeachersCache] = useState<ITeacher[]>([]);
  const [query, setQuery] = useState<string>('');
  const [subjects, setSubjects] = useState<IUserSubject[]>([]);
  const [shouldUpdateCharts, setShouldUpdateCharts] = useState(false);

  const updateUser = async (user: IUser) => {
    setUser(user);
    setShouldUpdateCharts(true);
    try {
      await FetchHelper.patchUser(user.uid, user);
    } catch (err) {
      return;
    }
  }

  const onGradePromptSubmit = async (value: number, weight: number, date: Date) => {
    if (!user) {
      return;
    }
    // Will be casted with no error because currentSubject will
    // never be null since onGradePromptSubmit is called by
    // interacting with a subject. Therefore a subject must exist.
    let index = user.subjects.indexOf(currentSubject as IUserSubject);
    const newGrade: IGrade = {
      value: value,
      weight: weight,
      date: date.toISOString()
    }
    try {
      await FetchHelper.postSubjectGrade(user.uid, index, newGrade);
    } catch (err) {
      return;
    }
    let updated = { ...user };//Object.assign({}, user);
    updated.subjects[index].grades.push(newGrade);
    updateUser(updated);
  }

  const onSubjectRemoveGrade = async (sIndex: number, gIndex: number) => {
    if (!user) {
      return;
    }
    let updated;
    try {
      await FetchHelper.deleteSubjectGrade(user.uid, sIndex, gIndex);
      updated = await FetchHelper.fetchUser(user.uid);
    } catch (err) {
      console.error(err);
      return;
    }
    updateUser(updated)
    setCurrentSubject(updated.subjects[sIndex]);
  }

  const onSPRemoveGrade = async (grade: IGrade, gIndex: number) => {
    if (!currentSubject || !user) {
      return;
    }
    // FIX UPDATE
    let sIndex = user.subjects.indexOf(currentSubject as IUserSubject);
    await onSubjectRemoveGrade(sIndex, gIndex);
  }

  const onTIBTeacherClick = async (teacher: ITeacher) => {
    if (!user || !currentSubject) {
      return;
    }
    let sIndex = user.subjects.indexOf(currentSubject);
    console.log(sIndex);
    let data = { ...currentSubject };//Object.assign({}, currentSubject);
    data.teacherId = teacher.uid;
    data.teacherName = `${teacher.surname} ${teacher.name}`;
    try {
      await FetchHelper.patchUserSubject(user.uid, sIndex, data);
      setDisplayTIB(false);
      updateUser(await FetchHelper.fetchUser(user.uid));
    } catch (err) {
      console.error(err);
    }
  }

  const onListSubjectClick = async (us: IUserSubject, index?: number) => {
    if (!user) {
      return;
    }
    let userSub = (!us && index) ? user.subjects[index] : us;
    setDisplayDetails(true)
    setCurrentSubject(userSub);
  }

  const onChartUpdate = () => {
    setShouldUpdateCharts(false);
  }

  const onSubjectDelete = async (index: number) => {
    if (!user) {
      return;
    }
    let updated = { ...user };
    updated.subjects.splice(index, 1);
    updateUser(updated);
  }

  const onSubjectAddGrade = async (us: IUserSubject) => {
    setDisplayGradePrompt(true);
    setCurrentSubject(us);
  }

  const onSubjectApply = async (subjectState: IUserSubject, index: number) => {
    // let updated = Object.assign({}, this.state.user);
    // updated.subjects[index] = subjectState;
    if (!user) {
      return;
    }
    try {
      await FetchHelper.patchUserSubject(user.uid, index, subjectState);
      updateUser(await FetchHelper.fetchUser(user.uid));
    } catch (err) {
      console.error(err);
      return;
    }
  }

  const onSubjectAdd = async () => {
    if (!user) {
      return;
    }
    const newSub: IUserSubject = {
      name: 'Materia',
      teacherName: 'Docente',
      grades: []
    }
    try {
      await FetchHelper.postUserSubject(user.uid, newSub);
    } catch (err) {
      return;
    }
    let updated = Object.assign({}, user);
    updated.subjects.push(newSub);
    updateUser(updated);
  }

  useEffect(() => {
    const fetch = async () => {
      let data: IUser;
      let teachers: ITeacher[];
      try {
        if (props.uuid !== null) {
          data = await FetchHelper.fetchUser(props.uuid);
        } else {
          data = await FetchHelper.fetchUser(-1);
        }

        teachers = await FetchHelper.fetchAllTeachers();
      } catch {
        setUnavailable(true);
        setUser(null);
        return;
      }
      setLoading(false);
      setUser(data);
      setSubjects(data.subjects);
      setTeachersCache(teachers);
    };
    fetch();
  }, [])

  useEffect(() => {
    if (user) {
      setSubjects(user.subjects.filter(
        v => v.name.toLowerCase().includes(query.toLowerCase())
          || v.teacherName.toLowerCase().includes(query.toLowerCase())));
    }
  }, [query]);

  // useEffect(() => {
  //   if (user) {
  //     setSubjects(user.subjects);
  //   }
  // }, [user?.subjects])

  /* Works but not the best */
  useEffect(() => {
    if (user) {
      setSubjects(user.subjects);
    }
  }, [user]);

  if (loading || user == null) {
    return (
      <Page displayPrompt={false} user={null}>
        <LoadingPage unavailable={unavailable} />
      </Page>
    );
  }

  let subjectPage;
  if (currentSubject) {
    // This variable is useless but typescript is dumb
    // and for some reason cant assure that `currentSubject`
    // will never be null. By doing this the error goes away.
    let subject = currentSubject;
    subjectPage =
      <SubjectPage
        subject={subject}
        onAbort={() => setDisplayDetails(ps => !ps)}
        onAddGrade={(v, w, d) => onGradePromptSubmit(v, w, d)}
        onRemoveGrade={(g, i) => onSPRemoveGrade(g, i)}
      />;
  }
  let gradePrompt =
    <GradePrompt
      title={`${currentSubject?.name || ''}`}
      onAbort={() => {
        setDisplayGradePrompt(false);
      }}
      onSubmit={
        (value, weight, date) => onGradePromptSubmit(value, weight, date)
      }
    />;
  let tib =
    <TeacherInfobox
      teachers={teachersCache}
      onAbort={() => setDisplayTIB(ps => !ps)}
      onTeacherClick={(t) => onTIBTeacherClick(t)}
    />;
  let activePrompt;
  if (displayDetails) {
    activePrompt = subjectPage;
  } else if (displayGradePrompt) {
    activePrompt = gradePrompt;
  } else if (displayTIB) {
    activePrompt = tib;
  } else {
    activePrompt = gradePrompt;
  }

  return (
    <Page
      displayPrompt={
        displayDetails
        || displayGradePrompt
        || displayTIB}
      user={user}
      promptElement={activePrompt}
      onListSubjectClick={(us) => onListSubjectClick(us)}>
      <div className="hp-main-content">
        <div className="hp-content-page">
          <div className="hp-welcome-panel">
            <WelcomeComponent name={user.name} />
          </div>
          <div className="hp-card hp-trend-panel hp-rise-opacity-in">
            <div className="hp-chart-wrapper">
              <div className="hp-chart">
                <AvgChart
                  dataset={{
                    label: 'Media',
                    backgroundColor: '#007eff',
                    data: GradeHelper.getAllAvgs(user.subjects)
                  }}
                  labels={user.subjects.map(s => s.name)}
                  shouldUpdate={shouldUpdateCharts}
                  onUpdate={() => onChartUpdate()}
                />
              </div>
              <div className="hp-chart">
                <TrendChart
                  dataset={{
                    label: 'Andamento',
                    data: GradeHelper.getAllGradesValuesByDate(user.subjects)
                  }}
                  labels={GradeHelper.getAllGradesByDate(user.subjects).map(g => GradeHelper.getDate(g))}
                  shouldUpdate={shouldUpdateCharts}
                  onUpdate={() => onChartUpdate()}
                />
              </div>
            </div>
          </div>
          <div className="hp-search-bar">
            <SearchBar
              onChange={text => setQuery(text)}
              placeholder="Materia o docente"
            />
          </div>
          <div className="hp-subjects">
            {subjects.map((s: IUserSubject, i: number) => {
              return <Subject
                subject={s}
                key={i}
                onDelete={() => onSubjectDelete(i)}
                onDetails={() => onListSubjectClick(s, i)}
                onAddGrade={() => onSubjectAddGrade(s)}
                onRemoveGrade={(g, gi) => onSubjectRemoveGrade(i, gi)}
                onApply={state => onSubjectApply(state, i)}
                onTIBDisplay={() => {
                  setCurrentSubject(s);
                  setDisplayTIB(ps => !ps)
                }}
              />
            })}
            <AddSubject onClick={() => onSubjectAdd()} />
          </div>
        </div>
      </div>
    </Page>
  );
}
export default HomePage;