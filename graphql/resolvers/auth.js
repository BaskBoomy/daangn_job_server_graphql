const User = require("../../models/user.js");
const jwt = require("jsonwebtoken");
const { config } = require("../../config.js");

function createJwtToken(id) {
    return jwt.sign({ id }, config.jwt.secretKey, { expiresIn: config.jwt.expiresInSec });
}
module.exports = {
    createUser: async args => {
        try {
            const userIsExist = await User.findOne({ phoneNumber: args.userInput.phoneNumber })
            if (userIsExist) {
                throw new Error('User exists already');
            }

            const user = new User({
                phoneNumber: args.userInput.phoneNumber,
                nickname: args.userInput.nickname
            });
            const result = await user.save();
            return { ...result._doc, _id: result.id }
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    login: async ({phoneNumber}) => {
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
    }
}