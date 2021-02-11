import { Component, ReactNode } from 'react';
import { IUser, IUserSubject } from '../../@types';
import Subject from '../subject/Subject';
import './home-page.css'
import { API_URL } from './../../util/constants';
import LoadingPage from '../LoadingPage/LoadingPage';
import { Router, withRouter } from 'react-router-dom';
import AddSubject from '../add-subject/AddSubject';

interface IHomePageState {

    loading: boolean;

    user: IUser | null;
}

class HomePage extends Component<{}, IHomePageState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            loading: true,
            user: null
        };
    }

    async componentDidMount() {
        const url: string = `${API_URL}users/0`;
        const response = await fetch(url);
        const data = await response.json();
        this.setState({
            loading: false,
            user: data
        });
    }

    render(): ReactNode {
        if (this.state.loading || this.state.user == null) {
            return <LoadingPage />;
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
                        {this.state.user.subjects.map((us: IUserSubject) => {
                            return <div className="hp-subject-wrap">
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
                        {this.state.user.subjects.map((s: IUserSubject) => {
                            return <Subject subject={s} />
                        })}
                        <AddSubject />
                    </div>
                </div>
            </div>
        );
    }
}



export default HomePage;
