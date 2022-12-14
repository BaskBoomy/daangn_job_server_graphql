import User from "../../models/user.js";
import jwt from "jsonwebtoken";
import { config } from "../../config.js";
import { user } from "./merge.js";
import { RootMutationCreateUserArgs, RootQueryLoginArgs, RootQueryUserArgs, UserInput } from "../../../gql-types.js";
import { Request } from "express";

function createJwtToken(id:string) {
    return jwt.sign({ id }, config.jwt.secretKey, { expiresIn: config.jwt.expiresInSec });
}
const authResolver = {
    createUser: async ({userInput}:RootMutationCreateUserArgs) => {
        try {
            const userIsExist = await User.findOne({ phoneNumber: userInput?.phoneNumber })
            if (userIsExist) {
                throw new Error('User exists already');
            }

            const user = new User({
                phoneNumber: userInput?.phoneNumber,
                nickname: userInput?.nickname
            });
            const result = await user.save() as any;
            return { ...result._doc, _id: result.id }
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    login: async ({phoneNumber}:RootQueryLoginArgs) => {
        try{
            const user = await User.findOne({phoneNumber:phoneNumber});
            if(!user){
                throw new Error('User does not exist'); 
            }
            const token = createJwtToken(user.id);
            return {
                userId: user.id,
                token,
            }
        }catch(err){
            throw err;
        }
    },
    user: ({userId}:RootQueryUserArgs) => user(userId),
    me: async (args:any, req:Request) => {
        if(!req.userId){
            throw new Error("Can not find User");
        }

        return user(req.userId);
    }
}

export default authResolver;