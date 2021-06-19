import AdminPage from './components/AdminPage/AdminPage';
import Auth from './auth/Auth';
import AuthorsPage from './components/AuthorsPage/AuthorsPage';
import FetchHelper from './helpers/FetchHelper';
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
import { Component, useState } from 'react';
import { Route } from 'react-router-dom';
import { useEffect } from 'react';
import { UserType } from './@types';

interface AppState {

  uuid: number | null;

  userType: UserType | null;
}

export default () => {
  const [uuid, setUuid] = useState<number | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);

  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/login">
            <LoginPage onLoginSuccess={uid => {
              setUuid(uid);
            }} />
          </Route>
          <ProtectedRoute exact path={ABOUT_ROUTE} render={() => <AuthorsPage uuid={uuid} />} />
          <ProtectedRoute exact path={TUTORIALS_ROUTE} render={() => <TutorialsPage uuid={uuid} />} />
          <ProtectedRoute exact path={HOME_ROUTE} render={() => {
            if (userType == UserType.STUDENT) {
              return <HomePage uuid={uuid} />
            } else if (userType == UserType.ADMIN) {
              return <AdminPage uuid={uuid} />
            } else if (userType == UserType.TEACHER) {
              return <TeacherPage tuid={uuid} />
            }
            return <HomePage uuid={uuid} />
          }} />
          {/* Handles 404 */}
          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}
