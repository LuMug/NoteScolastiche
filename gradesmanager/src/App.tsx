import AboutPage from './components/AboutPage/AboutPage';
import Auth from './auth/Auth';
import AuthorsPage from './components/AuthorsPage/AuthorsPage';
import HomePage from './components/HomePage/HomePage';
import LoginPage from './components/LoginPage/LoginPage';
import ProtectedRoute from './components/protected-route/ProtectedRoute';
import React, { Component } from 'react';
import TeacherPage from './components/TeacherPage/TeacherPage';
import {
  BrowserRouter,
  Redirect,
  RouteComponentProps,
  RouteProps,
  Switch
  } from 'react-router-dom';
import { IUser } from './@types';
import { Route } from 'react-router-dom';


export default class App extends Component<{}> {

  constructor(props: {}) {
    super(props);
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route exact path="/login">
              <LoginPage
                onLoginSuccess={uuid => { }}
              />
            </Route>
            <ProtectedRoute exact path="/teachers" render={() => <TeacherPage uuid={Auth.getUserUid() || -1} />} />
            <ProtectedRoute exact path="/about" render={() => <AboutPage />} />
            <ProtectedRoute exact path="/authors" render={() => <AuthorsPage uuid={Auth.getUserUid()} />} />
            <ProtectedRoute path="/" render={() => <HomePage uuid={Auth.getUserUid()} />} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}
