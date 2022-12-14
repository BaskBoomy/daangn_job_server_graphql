import { ObjectId,Schema, Types, model, Document } from "mongoose";
import { DocumentResult } from "../types/mongoose";
export interface IUser extends DocumentResult<IUser> {
    phoneNumber: string;
    nickname: string;
    borndate: string;
    gender: string;
    name: string;
    selfIntroduction: string;
    careers: [string];
    createdJobs: [ObjectId|string];
    appliedJobs: [ObjectId|string];
    likedJobs: [ObjectId|string];
}
const userSchema = new Schema<IUser>({
	phoneNumber: {
        type: String,
        required: true,
    },  
	nickname: {
        type: String,
        required: true,
    },
	borndate:  {
        type: String,
    },
	gender:  {
        type: String,
    },
	name:  {
        type: String,
    },
	selfIntroduction:  {
        type: String,
    },
	careers :  {
        type: [String],
    },
    createdJobs: [
        {
            type: Types.ObjectId,
            ref: 'JobsGQL'
        }
    ],
    appliedJobs: [
        {
            type: Types.ObjectId,
            ref: 'Apply'
        }
    ],
    likedJobs: [
        {
            type: Types.ObjectId,
            ref: 'Like'
        }
    ]
})

export default model('User', userSchema);