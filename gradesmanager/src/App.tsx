import AdminPage from './components/AdminPage/AdminPage';
import Auth from './auth/Auth';
import AuthorsPage from './components/AuthorsPage/AuthorsPage';
import HomePage from './components/HomePage/HomePage';
import LoginPage from './components/LoginPage/LoginPage';
import ProtectedRoute from './components/protected-route/ProtectedRoute';
import TeacherPage from './components/TeacherPage/TeacherPage';
import TutorialsPage from './components/TutorialsPage/TutorialsPage';
import {
  ABOUT_ROUTE,
  ADMIN_ROUTE,
  HOME_ROUTE,
  TEACHERS_ROUTE,
  TUTORIALS_ROUTE
  } from './util/constants';
import { BrowserRouter, Redirect, Switch } from 'react-router-dom';
import { Component } from 'react';
import { Route } from 'react-router-dom';
import { UserType } from './@types';

export default class App extends Component<{}> {

  constructor(props: {}) {
    super(props);
  }

  render() {
    let uid = (Auth.getUserUid() == null) ? -1 : Auth.getUserUid() as number;
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route exact path="/login">
              <LoginPage />
            </Route>
            <ProtectedRoute exact path={ABOUT_ROUTE} render={() => <AuthorsPage uuid={Auth.getUserUid()} />} />
            <ProtectedRoute exact path={TUTORIALS_ROUTE} render={() => <TutorialsPage uuid={Auth.getUserUid()} />} />
            <ProtectedRoute exact path={HOME_ROUTE} render={() => {
              if (Auth.getUserType() == UserType.STUDENT) {
                return <HomePage uuid={Auth.getUserUid()} />
              } else if (Auth.getUserType() == UserType.ADMIN) {
                return <AdminPage uuid={Auth.getUserUid()} />
              } else if (Auth.getUserType() == UserType.TEACHER) {
                return <TeacherPage tuid={uid} />
              }
              return <HomePage uuid={Auth.getUserUid()} />
            }} />
            {/* Handles 404 */}
            <Redirect to="/" />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}
