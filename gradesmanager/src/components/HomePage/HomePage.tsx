import * as CONSTANTS from './../../util/constants';
import AddSubject from '../add-subject/AddSubject';
import AvgChart from '../avg-chart/AvgChart';
import FetchHelper from '../../helpers/FetchHelper';
import GradeHelper from '../../helpers/GradeHelper';
import GradePrompt from '../grade-prompt/GradePrompt';
import LoadingPage from '../LoadingPage/LoadingPage';
import Nav from './../nav/Nav';
import React, { Component, ReactNode } from 'react';
import Subject from '../subject/Subject';
import SubjectPage from '../SubjectPage/SubjectPage';
import TeacherInfobox from '../teacher-infobox/TeacherInfobox';
import TrendChart from '../trend-chart/TrendChart';
import {
  IGrade,
  ITeacher,
  IUser,
  IUserSubject
  } from '../../@types';
import './home-page.css';

interface IHomePageState {

  loading: boolean;

  unavailable: boolean;

  user: IUser | null;

  displayDetails: boolean;

  displayGradePrompt: boolean;

  currentSubject: IUserSubject | null;

  teachersCache: ITeacher[];

  displayTIB: boolean;
}

class HomePage extends Component<{}, IHomePageState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      loading: true,
      user: null,
      unavailable: false,
      displayDetails: false,
      displayGradePrompt: false,
      currentSubject: null,
      teachersCache: [],
      displayTIB: false
    };
  }

  async componentDidMount() {
    let data: IUser;
    let teachers: ITeacher[];
    try {
      data = await FetchHelper.fetchUser(0);
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
      teachersCache: teachers
    });
  }

  private async updateUser(updated: IUser) {
    this.setState({
      user: updated
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
      name: 'Subject',
      teacherName: 'Surname Name',
      grades: []
    }
    try {
      await FetchHelper.postUserSubject(state.user?.uid, newSub);
    } catch (err) {
      return;
    }
    let updated = Object.assign({}, state.user);
    updated.subjects.push(newSub);
    this.setState({
      user: updated
    });
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
      return;
    }
    this.setState({
      user: updated,
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
      this.setState({ user: await FetchHelper.fetchUser(state.user.uid) });
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
    this.setState({
      user: updated
    });
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

  private async onListSubjectClick(state: IHomePageState, index: number) {
    if (state.user) {
      let us = state.user.subjects[index];
      this.setState({
        displayDetails: true,
        currentSubject: us
      });
    }
  }

  render(): ReactNode {
    if (this.state.loading || this.state.user == null) {
      return <LoadingPage unavailable={this.state.unavailable} />;
    }
    let subjectPage;
    if (this.state.currentSubject) {
      // This variable is useless but typescript is dumb
      // and for some reason cant assure that `currentSubject`
      // will never be null. By doing this the error goes away.
      let subject = this.state.currentSubject;
      subjectPage =
        <div className={`hp-prompt ${(this.state.displayDetails) ? '' : 'hidden'}`}>
          <SubjectPage
            subject={subject}
            onAbort={() => this.toggleSP()}
            onAddGrade={() => this.onSubjectAddGrade(subject)}
            onRemoveGrade={(g, i) => this.onSPRemoveGrade(this.state, g, i)}
          />
        </div>;
    }
    let gradePrompt = <div className={`hp-prompt ${(this.state.displayGradePrompt) ? '' : 'hidden'}`}>
      <GradePrompt
        title={`${this.state.currentSubject?.name}`}
        onAbort={() => {
          this.setState({ displayGradePrompt: false });
        }}
        onSubmit={
          (value, weight, date) => this.onGradePromptSubmit(this.state, value, weight, date)
        }
      />
    </div>;
    let tib = <div className={`hp-prompt ${(this.state.displayTIB) ? '' : 'hidden'}`}>
      <TeacherInfobox
        teachers={this.state.teachersCache}
        onAbort={() => this.toggleTIB()}
        onTeacherClick={(t) => this.onTIBTeacherClick(this.state, t)}
      />
    </div>;
    return (
      <div className="hp-main-content">
        <Nav
          routes={CONSTANTS.ROUTES}
          entries={this.state.user.subjects.map(s => s.name)}
          onEntryClick={(i) => this.onListSubjectClick(this.state, i)}
        />
        <div className="hp-content-page">
          <div className="hp-welcome-panel">
            <h1 className="hp-welcome-text">Benvenuto, <span>{this.state.user.name}</span></h1>
          </div>
          <div className="hp-welcome-separator"></div>
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
                />
              </div>
              <div className="hp-chart">
                <TrendChart
                  dataset={{
                    label: 'Andamento',
                    data: GradeHelper.getAllGradesValuesByDate(this.state.user.subjects)
                  }}
                  labels={GradeHelper.getAllGradesByDate(this.state.user.subjects).map(g => GradeHelper.getDate(g))}
                />
              </div>
            </div>
            {/* <div className="hp-trend-data">
              <div id="hp-section1" className="hp-trend-data-column">
                <div className="hp-trend-data-column-title">Section 1</div>
                <div className="hp-trend-data-mock"></div>
                <div className="hp-trend-data-mock"></div>
                <div className="hp-trend-data-mock"></div>
                <div className="hp-trend-data-mock"></div>
                <div className="hp-trend-data-mock"></div>
                <div className="hp-trend-data-mock"></div>
                <div className="hp-trend-data-mock"></div>
                <div className="hp-trend-data-mock"></div>
              </div>
              <div className="hp-trend-data-separator"></div>
              <div id="hp-section2" className="hp-trend-data-column">
                <div className="hp-trend-data-column-title">Section 2</div>
                <div className="hp-trend-data-mock"></div>
                <div className="hp-trend-data-mock"></div>
                <div className="hp-trend-data-mock"></div>
                <div className="hp-trend-data-mock"></div>
                <div className="hp-trend-data-mock"></div>
                <div className="hp-trend-data-mock"></div>
                <div className="hp-trend-data-mock"></div>
                <div className="hp-trend-data-mock"></div>
              </div>
            </div>
            <div className="hp-trend-data-page-switcher">
              <div id="hp-left"></div>
              <div id="hp-right"></div>
            </div> */}
          </div>
          <div className="hp-subjects">
            {this.state.user.subjects.map((s: IUserSubject, i: number) => {
              return <Subject
                subject={s}
                key={i}
                onDelete={() => this.onSubjectDelete(this.state, i)}
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
        {subjectPage}
        {gradePrompt}
        {tib}
      </div>
    );
  }
}

export default HomePage;
