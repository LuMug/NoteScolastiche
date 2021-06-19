import Auth from '../../auth/Auth';
import { Redirect, Route, RouteProps } from 'react-router';
import { useEffect } from 'react';

interface IProtectedRouteProps extends RouteProps { }

const ProtectedRoute: React.FunctionComponent<IProtectedRouteProps> = (props: IProtectedRouteProps) => {
    useEffect(() => {
        const fetch = async () => {
            await Auth.isLoggedIn();
        };
        fetch();
    });
    // could add custom condition
    if (!(sessionStorage.getItem('logged') === 'true' ? true : false)) {
        return <Redirect to='/login' />
    }
    return (
        <Route {...props} exact={props.exact} />
    );
}

export default ProtectedRoute;