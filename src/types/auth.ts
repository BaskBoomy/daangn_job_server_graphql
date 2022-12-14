import { Request } from "express";

export type RequestWithAuth = Request & {isAuth: boolean;userId: string;}