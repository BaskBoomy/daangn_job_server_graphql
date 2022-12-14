import { NextFunction, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { RequestWithAuth } from '../types/auth.js';
import { config } from '../config.js';
export const isAuth = (req:RequestWithAuth, res: Response, next: NextFunction) => {
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