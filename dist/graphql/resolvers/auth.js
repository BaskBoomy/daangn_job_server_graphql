var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from "../../models/user.js";
import jwt from "jsonwebtoken";
import { config } from "../../config.js";
import { user } from "./merge.js";
function createJwtToken(id) {
    return jwt.sign({ id }, config.jwt.secretKey, { expiresIn: config.jwt.expiresInSec });
}
const authResolver = {
    createUser: ({ userInput }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userIsExist = yield User.findOne({ phoneNumber: userInput === null || userInput === void 0 ? void 0 : userInput.phoneNumber });
            if (userIsExist) {
                throw new Error('User exists already');
            }
            const user = new User({
                phoneNumber: userInput === null || userInput === void 0 ? void 0 : userInput.phoneNumber,
                nickname: userInput === null || userInput === void 0 ? void 0 : userInput.nickname
            });
            const result = yield user.save();
            return Object.assign(Object.assign({}, result._doc), { _id: result.id });
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }),
    login: ({ phoneNumber }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User.findOne({ phoneNumber: phoneNumber });
            if (!user) {
                throw new Error('User does not exist');
            }
            const token = createJwtToken(user.id);
            return {
                userId: user.id,
                token,
            };
        }
        catch (err) {
            throw err;
        }
    }),
    user: ({ userId }) => user(userId),
    me: (args, req) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.userId) {
            throw new Error("Can not find User");
        }
        return user(req.userId);
    })
};
export default authResolver;
