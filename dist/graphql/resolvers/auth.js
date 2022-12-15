import jwt from "jsonwebtoken";
import User from "../../models/user.js";
import { config } from "../../config.js";
import { user } from "./merge.js";
import { compareAuthCode, create6DigitCode, saveAuthCode, sendMessage } from "../../service/sms.js";
function createJwtToken(id) {
    return jwt.sign({ id }, config.jwt.secretKey, { expiresIn: config.jwt.expiresInSec });
}
const authResolver = {
    createUser: async ({ userInput }) => {
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
                { message: "문자 발송 완료", code: 200 }
                : { message: "문자 발송 실패", code: 500 };
        })
            .catch((err) => console.log(err));
    },
    verifySMSCode: async ({ phoneNumber, code }) => {
        return await compareAuthCode(`sms-code-${phoneNumber}`, code.toString())
            .then((result) => {
            return result ?
                { message: "확인 완료", code: 200 }
                : { message: "번호가 일치하지 않습니다.", code: 203 };
        });
    }
};
export default authResolver;
