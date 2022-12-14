import { Schema, Types, model } from "mongoose";
const userSchema = new Schema({
    phoneNumber: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    borndate: {
        type: String,
    },
    gender: {
        type: String,
    },
    name: {
        type: String,
    },
    selfIntroduction: {
        type: String,
    },
    careers: {
        type: [String],
    },
    createdJobs: [
        {
            type: Types.ObjectId,
            ref: 'JobsGQL'
        }
    ]
});
export default model('User', userSchema);
