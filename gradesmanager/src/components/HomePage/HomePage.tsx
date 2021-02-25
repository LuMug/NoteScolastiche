import AddSubject from '../add-subject/AddSubject';
import LoadingPage from '../LoadingPage/LoadingPage';
import Subject from '../subject/Subject';
import SubjectPage from '../SubjectPage/SubjectPage';
import { API_URL } from './../../util/constants';
import { Component, ReactNode } from 'react';
import { IUser, IUserSubject } from '../../@types';
import './home-page.css';
import { Redirect, } from 'react-router-dom';

interface IHomePageState {

  loading: boolean;

  unavailable: boolean;

  user: IUser | null;

  displayDetails: boolean;

  displaySuid?: number;
}

class HomePage extends Component<{}, IHomePageState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      loading: true,
      user: null,
      unavailable: false,
      displayDetails: false
    };
  }

  async componentDidMount() {
    const url: string = `${API_URL}users/0`;
    let res;
    try {
      res = await fetch(url);
    } catch {
      this.setState({
        unavailable: true
      })
      return;
    }
    const data = await res.json();
    this.setState({
      loading: false,
      user: data
    });
  }

  private async updateUser(state: IHomePageState, updated: IUser) {
    const url = `${API_URL}users/${state.user?.uid}`;
    delete (updated as any)._id;
    const body = JSON.stringify({ user: updated });
    const reqOpts = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: body
    };
    try {
      await fetch(url, reqOpts);
    } catch (err) {
      console.error(err);
      return;
    }
    this.setState({
      user: updated
    });
  }

  private async onSubjectAdd(state: IHomePageState) {
    const url = `${API_URL}users/${state.user?.uid}/subjects`;
    const newSub: IUserSubject = {
      name: "Subject",
      teacherId: 0,
      grades: []
    }
    const body = JSON.stringify({ subject: newSub });
    const reqOpts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    };
    try {
      await fetch(url, reqOpts);
    } catch (err) {
      console.error(err);
      return;
    }
    let updated = Object.assign({}, state.user);
    updated.subjects.push(newSub);
    this.setState({
      user: updated
    }, () => console.log('dsad'));
  }

  private async onSubjectDelete(state: IHomePageState, index: number) {
    let updated = Object.assign({}, state).user;
    if (!updated) {
      return;
    }
    updated.subjects = updated.subjects.filter((us, i) => i != index);
    await this.updateUser(state, updated);
  }

  private async onSubjectEdit(state: IHomePageState, index: number) {
    // return new Promise<void>((resolve, reject) => {
    //     this.setState({
    //         displayDetails: true,
    //         displaySuid: index
    //     }, () => resolve());
    // });
    this.setState({
      displayDetails: true,
      displaySuid: index
    });
  }

  render(): ReactNode {
    if (this.state.loading || this.state.user == null) {
      return <LoadingPage unavailable={this.state.unavailable} />;
    }
    return (
      <div className="hp-main-content">
        <div className="hp-side-panel">
          <div className="hp-side-panel-section">
            <p className="hp-route-el">Home</p>
            <p className="hp-route-el">Materie</p>
            <p className="hp-route-el">Route X</p>
          </div>
          <div className="hp-side-panel-separator"></div>
          <div id="hp-subjects-list-panel" className="hp-side-panel-section">
            <p className="hp-side-panel-section-title">Materie</p>
            {this.state.user.subjects.map((us: IUserSubject, i: number) => {
              <Redirect to={`/subjects/${i}`} />
              return <div className="hp-subject-wrap" key={i} onClick={() => this.onSubjectEdit(this.state, i)}>
                <p className="hp-subject-el">{us.name}</p>
              </div>
            })}
          </div>
        </div>
        <div className="hp-content-page">
          <div className="hp-welcome-panel">
            <h1 className="hp-welcome-text">Benvenuto, <span>{this.state.user.name}</span></h1>
          </div>
          <div className="hp-welcome-separator"></div>
          <div className="hp-card trend-panel hp-rise-opacity-in">
            <div className="hp-chart-wrapper">
              <div className="hp-chart">
                <canvas id="hp-chartCanvas"></canvas>
              </div>
            </div>
            <div className="hp-trend-data">
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
            </div>
          </div>
          <div className="hp-subjects">
            {this.state.user.subjects.map((s: IUserSubject, i: number) => {
              return <Subject
                subject={s}
                key={i}
                onDelete={() => this.onSubjectDelete(this.state, i)}
                onEdit={() => this.onSubjectEdit(this.state, i)}
              />
            })}
            <AddSubject onClick={() => this.onSubjectAdd(this.state)} />
          </div>
        </div>
        <div onClick={() => { this.setState({ displayDetails: false }) }} id="subject-details" className={`hp-subject-detail ${(this.state.displayDetails) ? '' : 'hidden'}`}>
          <SubjectPage suid={(this.state.displaySuid) ? this.state.displaySuid : 0} uuid={this.state.user.uid} />
        </div>
      </div>
    );
  }
}

export default HomePage;
