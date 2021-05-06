import dotenv from 'dotenv';
import path from 'path';
import { NextFunction, Request, Response } from 'express';

dotenv.config({
    path: path.join(__dirname, '..', '.env')
});

export default (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization");
    if (token) {
        if (token === process.env.AUTH_TOKEN) {
            (req as any).authorized = true;
        }
    } else {
        console.error('Unauthorized access from: ', req.ip);
        (req as any).authorized = false;
    }
    next();
};

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    if ((req as any).authorized) {
        next();
    } else {
        console.error('Unauthorized access from: ', req.ip);
        return res.status(401).send('Unauthorized');
    }
};