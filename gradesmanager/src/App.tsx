import AboutPage from './components/AboutPage/AboutPage';
import Auth from './auth/Auth';
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
import { Route } from 'react-router-dom';

export default class App extends Component {

  constructor(props: {}) {
    super(props);
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <ProtectedRoute exact path="/teachers" render={() => <TeacherPage />} />
            <Route exact path="/login">
              <LoginPage
                onLoginSuccess={uuid => { }}
              />
            </Route>
            <ProtectedRoute exact path="/about" render={() => <AboutPage />} />
            {/* <ProtectedRoute exact path="/authors" render={() => <AuthorsPage user={null} />} /> */}
            <ProtectedRoute path="/" render={() => <HomePage uuid={Auth.getUser()?.uid || null} />} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}
