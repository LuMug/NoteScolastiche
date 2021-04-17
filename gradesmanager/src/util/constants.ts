import { IRouteDescritor } from '../@types';

export const API_URL: string = 'http://127.0.0.1:5000/api/v1/';

export const ROUTES: IRouteDescritor[] = [
    {
        name: 'Home',
        path: '/'
    },
    {
        name: 'Autori',
        path: '/authors'
    },
    {
        name: 'test',
        path: '/admins'
    },
    {
        name: 'Logout',
        path: '/login'
    }
];