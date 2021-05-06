import Auth from '../../auth/Auth';
import { Redirect, Route, RouteProps } from 'react-router';

interface IProtectedRouteProps extends RouteProps { }

const ProtectedRoute: React.FunctionComponent<IProtectedRouteProps> = (props: IProtectedRouteProps) => {
    // could add custom condition
    if (!Auth.isLoggedIn()) {
        return <Redirect to='/login' />
    }
    return (
        <Route {...props} exact={props.exact} />
    );
}

export default ProtectedRoute;