import jwt from "jsonwebtoken";
import User from "../../models/user.js";
import { config } from "../../config.js";
import { user } from "./merge.js";
import { compareAuthCode, create6DigitCode, saveAuthCode, sendMessage } from "../../service/sms.js";
function createJwtToken(id) {
    return jwt.sign({ id }, config.jwt.secretKey, { expiresIn: config.jwt.expiresInSec });
}
const authResolver = {
    createUser: async ({ userInput }, req) => {
        try {
            const userIsExist = await User.findOne({ phoneNumber: userInput === null || userInput === void 0 ? void 0 : userInput.phoneNumber });
            if (userIsExist) {
                throw new Error('User exists already');
            }
            const user = new User({
                phoneNumber: userInput === null || userInput === void 0 ? void 0 : userInput.phoneNumber,
                nickname: userInput === null || userInput === void 0 ? void 0 : userInput.nickname
            });
            const result = await user.save();
            req.session.user = result;
            return Object.assign(Object.assign({}, result._doc), { _id: result.id });
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    },
    login: async ({ phoneNumber }, req) => {
        try {
            const user = await User.findOne({ phoneNumber: phoneNumber });
            if (!user) {
                throw new Error('User does not exist');
            }
            req.session.user = user;
            const token = createJwtToken(user.id);
            return {
                userId: user.id,
                token,
            };
        }
        catch (err) {
            throw err;
        }
    },
    updateUser: async ({ userInput }, req) => {
        if (!req.isAuth) {
            throw new Error("Authentication Error");
        }
        try {
            return await User.findOneAndUpdate({ _id: req.userId }, { $set: userInput }, { returnDocument: 'after' })
                .then((result) => {
                console.log(result);
                req.session.user = result;
                return Object.assign(Object.assign({}, result._doc), { _id: result.id });
            });
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    },
    user: ({ userId }) => user(userId),
    me: async (args, req) => {
        if (!req.userId) {
            throw new Error("Can not find User");
        }
        return user(req.userId);
    },
    sendSMSCode: async ({ phoneNumber }) => {
        const code = create6DigitCode();
        saveAuthCode(`sms-code-${phoneNumber}`, code);
        return await sendMessage(phoneNumber, code)
            .then((result) => {
            return result ?
                { message: "?????? ?????? ??????", code: 200 }
                : { message: "?????? ?????? ??????", code: 500 };
        })
            .catch((err) => console.log(err));
    },
    verifySMSCode: async ({ phoneNumber, code }) => {
        return await compareAuthCode(`sms-code-${phoneNumber}`, code.toString())
            .then((result) => {
            return result ?
                { message: "?????? ??????", code: 200 }
                : { message: "????????? ???????????? ????????????.", code: 203 };
        });
    }
};
export default authResolver;
