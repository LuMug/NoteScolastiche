import { IRouteDescritor } from '../@types';

export const API_URL = 'http://127.0.0.1:5000/api/v1/';

export const HOME_ROUTE = '/';

export const ADMIN_ROUTE = '/admins';

export const TEACHERS_ROUTE = '/teachers';

export const ABOUT_ROUTE = '/about';

export const LOGIN_ROUTE = '/login';

export const ROUTES: IRouteDescritor[] = [
    {
        name: 'Home',
        path: HOME_ROUTE
    },
    {
        name: 'Informazioni',
        path: ABOUT_ROUTE
    },
    {
        name: 'Logout',
        path: LOGIN_ROUTE
    }
];