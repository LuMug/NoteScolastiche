import AddSubject from '../add-subject/AddSubject';
import AvgChart from '../avg-chart/AvgChart';
import FetchHelper from '../../helpers/FetchHelper';
import GradeHelper from '../../helpers/GradeHelper';
import GradePrompt from '../grade-prompt/GradePrompt';
import LoadingPage from '../LoadingPage/LoadingPage';
import Page from '../Page/Page';
import SearchBar from '../search-bar/SearchBar';
import Subject from '../subject/Subject';
import SubjectPage from '../SubjectPage/SubjectPage';
import TeacherInfobox from '../teacher-infobox/TeacherInfobox';
import TrendChart from '../trend-chart/TrendChart';
import WelcomeComponent from '../welcome-component/WelcomeComponent';
import { Component, ReactNode, useState } from 'react';
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

interface IHomePageState {

  loading: boolean;

  unavailable: boolean;

  user: IUser | null;

  displayDetails: boolean;

  displayGradePrompt: boolean;

  currentSubject: IUserSubject | null;

  teachersCache: ITeacher[];

  displayTIB: boolean;

  query: string;

  subjects: IUserSubject[];

  shouldUpdateCharts: boolean;
}


class HomePage extends Component<IHomePageProps, IHomePageState> {

  constructor(props: IHomePageProps) {
    super(props);
    this.state = {
      loading: true,
      user: null,
      unavailable: false,
      displayDetails: false,
      displayGradePrompt: false,
      currentSubject: null,
      teachersCache: [],
      displayTIB: false,
      query: '',
      subjects: [],
      shouldUpdateCharts: false
    };
  }

  async componentDidMount() {
    let data: IUser;
    let teachers: ITeacher[];
    try {
      if (this.props.uuid !== null) {
        data = await FetchHelper.fetchUser(this.props.uuid);
      } else {
        data = await FetchHelper.fetchUser(-1);
      }

      teachers = await FetchHelper.fetchAllTeachers();
    } catch {
      this.setState({
        unavailable: true,
        user: null
      });
      return;
    }
    this.setState({
      loading: false,
      user: data,
      subjects: data.subjects,
      teachersCache: teachers
    });
  }

  componentDidUpdate(pp: IHomePageProps, ps: IHomePageState) {
    if (this.state.query != ps.query && this.state.user) {
      this.setState({
        subjects: this.state.user.subjects.filter(
          v => v.name.toLowerCase().includes(this.state.query.toLowerCase())
            || v.teacherName.toLowerCase().includes(this.state.query.toLowerCase()))
      });
    }
  }

  private async updateUser(updated: IUser) {
    this.setState({
      user: updated,
      shouldUpdateCharts: true
    });
    try {
      await FetchHelper.patchUser(updated.uid, updated);
    } catch (err) {
      return;
    }
  }

  private async onSubjectAdd(state: IHomePageState) {
    if (!state.user) {
      return;
    }
    const newSub: IUserSubject = {
      name: 'Materia',
      teacherName: 'Docente',
      grades: []
    }
    try {
      await FetchHelper.postUserSubject(state.user.uid, newSub);
    } catch (err) {
      return;
    }
    let updated = Object.assign({}, state.user);
    updated.subjects.push(newSub);
    this.updateUser(updated);
  }

  private async onSubjectDelete(state: IHomePageState, index: number) {
    let updated = Object.assign({}, state).user;
    if (!updated) {
      return;
    }
    updated.subjects.splice(index, 1);
    this.updateUser(updated);
  }

  private async onSubjectAddGrade(us: IUserSubject) {
    this.setState({
      displayGradePrompt: true,
      currentSubject: us
    });
  }

  private async onSubjectRemoveGrade(state: IHomePageState, sIndex: number, gIndex: number) {
    if (!state.user) {
      return;
    }
    let updated;
    try {
      await FetchHelper.deleteSubjectGrade(state.user.uid, sIndex, gIndex);
      updated = await FetchHelper.fetchUser(state.user.uid);
    } catch (err) {
      console.error(err);
      return;
    }
    this.updateUser(updated)
    this.setState({
      currentSubject: updated.subjects[sIndex]
    });
  }

  private async onSPRemoveGrade(state: IHomePageState, grade: IGrade, gIndex: number) {
    if (!state.currentSubject || !state.user) {
      return;
    }
    // FIX UPDATE
    let sIndex = state.user.subjects.indexOf(this.state.currentSubject as IUserSubject);
    await this.onSubjectRemoveGrade(state, sIndex, gIndex);
  }

  private async onSubjectApply(state: IHomePageState, subjectState: IUserSubject, index: number) {
    // let updated = Object.assign({}, this.state.user);
    // updated.subjects[index] = subjectState;
    if (!state.user) {
      return;
    }
    try {
      await FetchHelper.patchUserSubject(state.user.uid, index, subjectState);
      this.updateUser(await FetchHelper.fetchUser(state.user.uid));
    } catch (err) {
      console.error(err);
      return;
    }
  }

  private async onGradePromptSubmit(state: IHomePageState, value: number, weight: number, date: Date) {
    if (!state.user) {
      return;
    }
    // Will be casted with no error because currentSubject will
    // never be null since onGradePromptSubmit is called by
    // interacting with a subject. Therefore a subject must exist.
    let index = state.user.subjects.indexOf(state.currentSubject as IUserSubject);
    const newGrade: IGrade = {
      value: value,
      weight: weight,
      date: date.toISOString()
    }
    try {
      await FetchHelper.postSubjectGrade(state.user?.uid, index, newGrade);
    } catch (err) {
      return;
    }
    let updated = Object.assign({}, state.user);
    updated.subjects[index].grades.push(newGrade);
    this.updateUser(updated);
  }

  private async onTIBTeacherClick(state: IHomePageState, teacher: ITeacher) {
    if (!state.user || !state.currentSubject) {
      return;
    }
    let sIndex = state.user.subjects.indexOf(state.currentSubject);
    let data = Object.assign({}, state.currentSubject);
    data.teacherId = teacher.uid;
    data.teacherName = `${teacher.surname} ${teacher.name}`;
    try {
      await FetchHelper.patchUserSubject(state.user.uid, sIndex, data);
      this.setState({
        displayTIB: false,
        user: await FetchHelper.fetchUser(state.user.uid)
      });
    } catch (err) {
      console.error(err);
    }
  }

  private toggleTIB() {
    this.setState({
      displayTIB: !this.state.displayTIB
    });
  }

  private toggleSP() {
    this.setState({
      displayDetails: !this.state.displayDetails
    });
  }

  private async onListSubjectClick(state: IHomePageState, us: IUserSubject, index?: number) {
    if (state.user) {
      let userSub = (!us && index) ? state.user.subjects[index] : us;
      this.setState({
        displayDetails: true,
        currentSubject: userSub
      });
    }
  }

  private onChartUpdate() {
    this.setState({
      shouldUpdateCharts: false
    });
  }

  render(): ReactNode {
    if (this.state.loading || this.state.user == null) {
      return (
        <Page displayPrompt={false} user={null}>
          <LoadingPage unavailable={this.state.unavailable} />
        </Page>
      );
    }

    let subjectPage;
    if (this.state.currentSubject) {
      // This variable is useless but typescript is dumb
      // and for some reason cant assure that `currentSubject`
      // will never be null. By doing this the error goes away.
      let subject = this.state.currentSubject;
      subjectPage =
        <SubjectPage
          subject={subject}
          onAbort={() => this.toggleSP()}
          onAddGrade={(v, w, d) => this.onGradePromptSubmit(this.state, v, w, d)}
          onRemoveGrade={(g, i) => this.onSPRemoveGrade(this.state, g, i)}
        />;
    }
    let gradePrompt =
      <GradePrompt
        title={`${this.state.currentSubject?.name}`}
        onAbort={() => {
          this.setState({ displayGradePrompt: false });
        }}
        onSubmit={
          (value, weight, date) => this.onGradePromptSubmit(this.state, value, weight, date)
        }
      />;
    let tib =
      <TeacherInfobox
        teachers={this.state.teachersCache}
        onAbort={() => this.toggleTIB()}
        onTeacherClick={(t) => this.onTIBTeacherClick(this.state, t)}
      />;
    let activePrompt;
    if (this.state.displayDetails) {
      activePrompt = subjectPage;
    } else if (this.state.displayGradePrompt) {
      activePrompt = gradePrompt;
    } else if (this.state.displayTIB) {
      activePrompt = tib;
    } else {
      activePrompt = gradePrompt;
    }

    return (
      <Page
        displayPrompt={
          this.state.displayDetails
          || this.state.displayGradePrompt
          || this.state.displayTIB}
        user={this.state.user}
        promptElement={activePrompt}
        onListSubjectClick={(us) => this.onListSubjectClick(this.state, us)}>
        <div className="hp-main-content">
          <div className="hp-content-page">
            <div className="hp-welcome-panel">
              <WelcomeComponent name={this.state.user.name} />
            </div>
            <div className="hp-card hp-trend-panel hp-rise-opacity-in">
              <div className="hp-chart-wrapper">
                <div className="hp-chart">
                  <AvgChart
                    dataset={{
                      label: 'Media',
                      backgroundColor: '#007eff',
                      data: GradeHelper.getAllAvgs(this.state.user.subjects)
                    }}
                    labels={this.state.user.subjects.map(s => s.name)}
                    shouldUpdate={this.state.shouldUpdateCharts}
                    onUpdate={() => this.onChartUpdate()}
                  />
                </div>
                <div className="hp-chart">
                  <TrendChart
                    dataset={{
                      label: 'Andamento',
                      data: GradeHelper.getAllGradesValuesByDate(this.state.user.subjects)
                    }}
                    labels={GradeHelper.getAllGradesByDate(this.state.user.subjects).map(g => GradeHelper.getDate(g))}
                    shouldUpdate={this.state.shouldUpdateCharts}
                    onUpdate={() => this.onChartUpdate()}
                  />
                </div>
              </div>
            </div>
            <div className="hp-search-bar">
              <SearchBar
                onChange={text => this.setState({ query: text })}
                placeholder="Materia o docente"
              />
            </div>
            <div className="hp-subjects">
              {this.state.subjects.map((s: IUserSubject, i: number) => {
                return <Subject
                  subject={s}
                  key={i}
                  onDelete={() => this.onSubjectDelete(this.state, i)}
                  onDetails={() => this.onListSubjectClick(this.state, s, i)}
                  onAddGrade={() => this.onSubjectAddGrade(s)}
                  onRemoveGrade={(g, gi) => this.onSubjectRemoveGrade(this.state, i, gi)}
                  onApply={(state) => this.onSubjectApply(this.state, state, i)}
                  onTIBDisplay={() => {
                    this.setState({
                      currentSubject: s
                    });
                    this.toggleTIB();
                  }}
                />
              })}
              <AddSubject onClick={() => this.onSubjectAdd(this.state)} />
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

export default HomePage;
