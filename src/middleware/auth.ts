import { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../../gql-types.js';
import { config } from '../config.js';
import { IUser } from '../models/user.js';
declare module 'express-serve-static-core' {
    export interface Request{
        isAuth: boolean;
        userId: string;
        user:IUser;
        session:session.Session & {user: IUser} //session에 user 정보 존재하는지 확인
    }
}
export const isAuth = (req:Request, res: Response, next: NextFunction) => {
    let token;
    // header 검사
    const authHeader = req.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    // header에 token이 없다면 cookie 확인
    if (!token) {
        token = req.cookies['token'];
    }
    
    if (!token) {
        req.isAuth = false;
        return next();
    }

    let decodedToken:JwtPayload;
    try{
        decodedToken = jwt.verify(token,config.jwt.secretKey) as JwtPayload;
    }catch(err){
        req.isAuth = false;
        return next();
    }
    
    if(!decodedToken){
        req.isAuth = false;
        return next();
    }

    req.isAuth = true;
    req.userId = decodedToken.id;
    next();
}

export const isProtect = (req: Request, res: Response, next:NextFunction) => {
    const {user} = req.session;

    if(!user){
        req.isAuth = false;
        return next();
    }
    
    req.user = user;
    next();
}