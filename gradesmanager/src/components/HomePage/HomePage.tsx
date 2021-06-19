import AddSubject from '../add-subject/AddSubject';
import Auth from '../../auth/Auth';
import AvgChart from '../avg-chart/AvgChart';
import CircularFadeBorder from '../circular-fade-border/CircularFadeBorder';
import FetchHelper from '../../helpers/FetchHelper';
import GradeHelper from '../../helpers/GradeHelper';
import GradePrompt from '../grade-prompt/GradePrompt';
import LoadingPage from '../LoadingPage/LoadingPage';
import Page from '../Page/Page';
import Prompt from '../prompt/Prompt';
import React, { useEffect, useState } from 'react';
import SearchBar from '../search-bar/SearchBar';
import Subject from '../subject/Subject';
import SubjectPage from '../SubjectPage/SubjectPage';
import TeacherInfobox from '../teacher-infobox/TeacherInfobox';
import TrendChart from '../trend-chart/TrendChart';
import WelcomeComponent from '../welcome-component/WelcomeComponent';
import WelcomePrompt from '../welcome-prompt/WelcomePrompt';
import {
  IGrade,
  ITeacher,
  IUser,
  IUserSubject
  } from '../../@types';
import { toast } from 'react-toastify';
import './home-page.css';
import 'react-toastify/dist/ReactToastify.css';

interface IHomePageProps {

  uuid: number | null;
}

// toast.configure();

let deleteLastUS = true;

const HomePage: React.FunctionComponent<IHomePageProps> = (props) => {
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [displayDetails, setDisplayDetails] = useState(false);
  const [displayGradePrompt, setDisplayGradePrompt] = useState(false);
  const [displayTIB, setDisplayTIB] = useState(false);
  const [displayMessage, setDisplayMessage] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<IUserSubject | null>(null);
  const [teachersCache, setTeachersCache] = useState<ITeacher[]>([]);
  const [query, setQuery] = useState<string>('');
  const [subjects, setSubjects] = useState<IUserSubject[]>([]);
  const [shouldUpdateCharts, setShouldUpdateCharts] = useState(false);
  const dispPrompt = displayDetails || displayGradePrompt || displayTIB || displayMessage;

  const updateUser = async (user: IUser, updateCharts?: boolean) => {
    setUser(user);
    setShouldUpdateCharts(updateCharts === undefined ? true : updateCharts);
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
    let updated = { ...user };
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

  const onSPEditGrade = async (grade: IGrade, sIndex: number, gIndex: number) => {
    if (!currentSubject || !user || sIndex == -1 || gIndex == -1) {
      return;
    }
    try {
      await FetchHelper.patchSubjectGrade(user.uid, sIndex, gIndex, grade);
      let u = await FetchHelper.fetchUser(user.uid);
      setUser(u);
      setCurrentSubject(u.subjects[sIndex]);
      setShouldUpdateCharts(true);
    } catch (err) {
      console.error(err);
    }
  }

  const onTIBTeacherClick = async (teacher: ITeacher) => {
    if (!user || !currentSubject) {
      return;
    }
    let sIndex = user.subjects.indexOf(currentSubject);
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
    // toast.dark(`Delete ${user.subjects[index].name}?`, {
    //   position: 'bottom-right',
    //   onClick: () => {
    //     deleteLastUS = false;
    //   },
    //   onClose: () => {
    //     if (deleteLastUS) {
    // let updated = { ...user };
    // updated.subjects.splice(index, 1);
    // updateUser(updated);
    //     }
    //     deleteLastUS = true;
    //   }
    // });
    let updated = { ...user };
    updated.subjects.splice(index, 1);
    updateUser(updated);
  }

  const onSubjectAddGrade = async (us: IUserSubject) => {
    setDisplayGradePrompt(true);
    setCurrentSubject(us);
  }

  const onSubjectApply = async (subject: IUserSubject, index: number) => {
    // let updated = Object.assign({}, this.state.user);
    // updated.subjects[index] = subjectState;
    if (!user) {
      return;
    }
    try {
      console.log(subject);

      await FetchHelper.patchUserSubject(user.uid, index, subject);
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

  const onWelcomePromptAbort = async () => {
    if (user) {
      let updated = { ...user };
      updated.hasReadWelcomeMsg = true;
      updateUser(updated, false);
    }
    setDisplayMessage(false);
  }

  useEffect(() => {
    const fetch = async () => {
      let data: IUser | null;
      let teachers: ITeacher[];
      try {
        data = await Auth.getUser();
        if (data) {
          setLoading(false);
          setUser(data);
          setSubjects(data.subjects);
          setDisplayMessage(!data.hasReadWelcomeMsg);
          teachers = await FetchHelper.fetchAllTeachers();
          setTeachersCache(teachers);
        } else {
          setUnavailable(true);
          setUser(null);
          return;
        }
      } catch (error) {
        console.error(error);
        setUnavailable(true);
        setUser(null);
        return;
      }
    };
    fetch();
  }, [])

  // useEffect(() => {
  //   toasts.forEach((t, i) => {
  //     if (t.time == 0) {
  //       console.log('deleted');
  //       let updated = [...toasts];
  //       updated.splice(i, 1);
  //       setToasts(updated);
  //     }
  //   });
  // }, [toasts])

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

  console.log('loading', loading);
  console.log('user', user);

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
    subjectPage =
      <SubjectPage
        subject={currentSubject}
        onAbort={() => setDisplayDetails(ps => !ps)}
        onAddGrade={(v, w, d) => onGradePromptSubmit(v, w, d)}
        onRemoveGrade={(g, i) => onSPRemoveGrade(g, i)}
        onEditGrade={(g, i) => onSPEditGrade(g, user.subjects.indexOf(currentSubject), i)}
      />;
  }
  let gradePrompt =
    <GradePrompt
      title={`${currentSubject?.name || ''}`}
      onAbort={() => {
        setDisplayGradePrompt(false);
      }}
      onSubmit={
        (value, weight, date) => {
          setDisplayGradePrompt(false);
          onGradePromptSubmit(value, weight, date);
        }
      }
    />;
  let tib =
    <TeacherInfobox
      teachers={teachersCache}
      onAbort={() => setDisplayTIB(ps => !ps)}
      onTeacherClick={(t) => onTIBTeacherClick(t)}
    />;
  let activePrompt = undefined;
  if (displayDetails) {
    activePrompt = subjectPage;
  } else if (displayGradePrompt) {
    activePrompt = gradePrompt;
  } else if (displayTIB) {
    activePrompt = tib;
  } else if (displayMessage) {
    activePrompt = <WelcomePrompt onAbort={() => onWelcomePromptAbort()} />;
  }

  let totalAvg = GradeHelper.getTotalAvg(user.subjects);

  return (
    <Page
      displayPrompt={dispPrompt}
      user={user}
      promptElement={activePrompt}
      onListSubjectClick={(us) => onListSubjectClick(us)}
      passiveNav={false}>
      <div className="hp-main-content">
        <div className="hp-content-page">
          <div className="hp-welcome-panel">
            <div className="hp-welcome-comp">
              <WelcomeComponent name={user.name} />
            </div>
            <div className="hp-total-avg-wrapper">
              <div className="hp-total-avg">
                <CircularFadeBorder fontSize="small">
                  <p>{(totalAvg == 0) ? '-' : GradeHelper.valueToString(totalAvg)}</p>
                </CircularFadeBorder>
              </div>
            </div>
          </div>
          <div className="hp-card hp-trend-panel hp-rise-opacity-in">
            <div className="hp-chart-wrapper">
              <div className="hp-chart">
                <AvgChart
                  dataset={{
                    label: 'Media',
                    // backgroundColor: '#5900ff',
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
                  dataset={
                    {
                      label: 'Andamento',
                      data: GradeHelper.getAllGradesValuesByDate(user.subjects)
                    }}
                  // labels={GradeHelper.getAllGradesByDateWithSubject(user.subjects).map(gwn => {
                  //   return `${gwn.name} - ${GradeHelper.getDate(gwn.grade)}`
                  // })}
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
              placeholder="Cerca materia o docente"
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