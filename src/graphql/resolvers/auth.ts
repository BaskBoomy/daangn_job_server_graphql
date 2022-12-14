import { Request } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../../models/user.js";
import { config } from "../../config.js";
import { user } from "./merge.js";
import { RootMutationCreateUserArgs, RootQueryLoginArgs, RootMutationSendSmsCodeArgs, RootQueryUserArgs, RootMutationVerifySmsCodeArgs, RootMutationUpdateUserArgs } from "../../../gql-types.js";
import { compareAuthCode, create6DigitCode, saveAuthCode, sendMessage } from "../../service/sms.js";
import { ObjectId } from "mongoose";

function createJwtToken(id:string) {
    return jwt.sign({ id }, config.jwt.secretKey, { expiresIn: config.jwt.expiresInSec });
}
const authResolver = {
    createUser: async ({userInput}:RootMutationCreateUserArgs, req: Request) => {
        try {
            const userIsExist = await User.findOne({ phoneNumber: userInput?.phoneNumber })
            if (userIsExist) {
                throw new Error('User exists already');
            }

            const user = new User({
                phoneNumber: userInput?.phoneNumber,
                nickname: userInput?.nickname
            });
            
            const result = await user.save() as IUser;
            req.session.user = result;
            return { ...result._doc, _id: result.id }
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    login: async ({phoneNumber}:RootQueryLoginArgs, req:Request) => {
        try{
            const user = await User.findOne({phoneNumber:phoneNumber});
            if(!user){
                throw new Error('User does not exist'); 
            }
            
            req.session.user = user;
            const token = createJwtToken(user.id);
            return {
                userId: user.id,
                token,
            }
        }catch(err){
            throw err;
        }
    },
    updateUser: async ({userInput}:RootMutationUpdateUserArgs, req: Request) => {
        if(!req.isAuth){
            throw new Error("Authentication Error");
        }
        try {
            return await User.findOneAndUpdate(
                {_id: req.userId},
                {$set: userInput as IUser},
                {returnDocument: 'after'}
            )
            .then((result:(IUser & { _id: ObjectId; }) | null) =>{
                console.log(result);
                
                req.session.user = result as IUser;
                return { ...result!._doc, _id: result!.id }
            })

        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    user: ({userId}:RootQueryUserArgs) => user(userId),
    me: async (args:any, req:Request) => {
        if(!req.userId){
            throw new Error("Can not find User");
        }

        return user(req.userId);
    },
    sendSMSCode: async ({phoneNumber}:RootMutationSendSmsCodeArgs) => {
        const code = create6DigitCode();
        saveAuthCode(`sms-code-${phoneNumber}`, code);
        return await sendMessage(phoneNumber, code)
            .then((result)=>{
                return result ? 
                { message: "?????? ?????? ??????", code:200 }
                :{ message: "?????? ?????? ??????", code:500 };
            })
            .catch((err)=>console.log(err))
    },
    verifySMSCode: async ({phoneNumber, code}:RootMutationVerifySmsCodeArgs) => {
        return await compareAuthCode(`sms-code-${phoneNumber}`, code.toString())
            .then((result)=>{
                return result ? 
                { message: "?????? ??????", code:200 }
                :{ message: "????????? ???????????? ????????????.", code:203 };
            })
    }
}

export default authResolver;