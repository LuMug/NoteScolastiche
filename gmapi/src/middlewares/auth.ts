import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.join(__dirname, '..', '.env')
});

export default (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("authorization");
    // console.log(process.env.AUTH_TOKEN);

    if (token == process.env.AUTH_TOKEN) {
        (req as any).authorized = true;
    } else {
        (req as any).authorized = false;
    }
    next();
};

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    if ((req as any).authorized) {
        next();
    } else {
        return res.status(401).send('Unauthorized');
    }
};