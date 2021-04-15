import Auth from '../../auth/Auth';
import React, { Component } from 'react';
import { Redirect, Route, RouteProps } from 'react-router';

interface IProtectedRouteProps extends RouteProps { }

function ProtectedRoute(props: IProtectedRouteProps) {
    if (!Auth.isLoggedIn()) {
        return <Redirect to='/login' />
    }
    return (
        <Route {...props} exact={props.exact} />
    );
}

export default ProtectedRoute;