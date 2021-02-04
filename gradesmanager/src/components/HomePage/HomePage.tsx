import React, { Component, ReactNode } from 'react';
import { IUser, IUserSubject } from '../../@types';
import Subject from '../subject/Subject';
import './home-page.css'

interface IHomePageProps {

    user: IUser;
}
interface State { }

class HomePage extends Component<IHomePageProps, State> {

    constructor(props: IHomePageProps) {
        super(props);
    }

    render(): ReactNode {
        return (
            <div className="main-content">
                <div className="side-panel">
                    <div className="side-panel-section">
                        <p className="route-el">Home</p>
                        <p className="route-el">Materie</p>
                        <p className="route-el">Route X</p>
                    </div>
                    <div className="side-panel-separator"></div>
                    <div id="subjects-list-panel" className="side-panel-section">
                        <p className="side-panel-section-title">Materie</p>
                        <div className="subject-wrap">
                            <p className="subject-el"></p>
                            <div className="mock-text"></div>
                        </div>
                        <div className="subject-wrap">
                            <p className="subject-el"></p>
                            <div className="mock-text"></div>
                        </div>
                        <div className="subject-wrap">
                            <p className="subject-el"></p>
                            <div className="mock-text"></div>
                        </div>
                        <div className="subject-wrap">
                            <p className="subject-el"></p>
                            <div className="mock-text"></div>
                        </div>
                        <div className="subject-wrap">
                            <p className="subject-el"></p>
                            <div className="mock-text"></div>
                        </div>
                        <div className="subject-wrap">
                            <p className="subject-el"></p>
                            <div className="mock-text"></div>
                        </div>
                        <div className="subject-wrap">
                            <p className="subject-el"></p>
                            <div className="mock-text"></div>
                        </div>
                        <div className="subject-wrap">
                            <p className="subject-el"></p>
                            <div className="mock-text"></div>
                        </div>
                        <div className="subject-wrap">
                            <p className="subject-el"></p>
                            <div className="mock-text"></div>
                        </div>
                        <div className="subject-wrap">
                            <p className="subject-el"></p>
                            <div className="mock-text"></div>
                        </div>
                        <div className="subject-wrap">
                            <p className="subject-el"></p>
                            <div className="mock-text"></div>
                        </div>
                        <div className="subject-wrap">
                            <p className="subject-el"></p>
                            <div className="mock-text"></div>
                        </div>
                        <div className="subject-wrap">
                            <p className="subject-el"></p>
                            <div className="mock-text"></div>
                        </div>
                        <div className="subject-wrap">
                            <p className="subject-el"></p>
                            <div className="mock-text"></div>
                        </div>
                        <div className="subject-wrap">
                            <p className="subject-el"></p>
                            <div className="mock-text"></div>
                        </div>
                        <div className="subject-wrap">
                            <p className="subject-el"></p>
                            <div className="mock-text"></div>
                        </div>
                        <div className="subject-wrap">
                            <p className="subject-el"></p>
                            <div className="mock-text"></div>
                        </div>
                    </div>
                </div>
                <div className="content-page">
                    <div className="welcome-panel">
                        <h1 className="welcome-text">Benvenuto, <span>{this.props.user.name}</span></h1>
                    </div>
                    <div className="welcome-separator"></div>
                    <div className="card trend-panel rise-opacity-in">
                        <div className="chart-wrapper">
                            <div className="chart">
                                <canvas id="chartCanvas"></canvas>
                            </div>
                        </div>
                        <div className="trend-data">
                            <div id="section1" className="trend-data-column">
                                <div className="trend-data-column-title">Section 1</div>
                                <div className="trend-data-mock"></div>
                                <div className="trend-data-mock"></div>
                                <div className="trend-data-mock"></div>
                                <div className="trend-data-mock"></div>
                                <div className="trend-data-mock"></div>
                                <div className="trend-data-mock"></div>
                                <div className="trend-data-mock"></div>
                                <div className="trend-data-mock"></div>
                            </div>
                            <div className="trend-data-separator"></div>
                            <div id="section2" className="trend-data-column">
                                <div className="trend-data-column-title">Section 2</div>
                                <div className="trend-data-mock"></div>
                                <div className="trend-data-mock"></div>
                                <div className="trend-data-mock"></div>
                                <div className="trend-data-mock"></div>
                                <div className="trend-data-mock"></div>
                                <div className="trend-data-mock"></div>
                                <div className="trend-data-mock"></div>
                                <div className="trend-data-mock"></div>
                            </div>
                        </div>
                        <div className="trend-data-page-switcher">
                            <div id="left"></div>
                            <div id="right"></div>
                        </div>
                    </div>
                    <div className="subjects">
                        {this.props.user.subjects.map((s: IUserSubject) => {
                            return <Subject name="dsad" subjectObj={s} teacherName="teacher name" />
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage
