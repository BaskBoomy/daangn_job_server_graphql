import { ObjectId,Schema, Types, model } from "mongoose";
import { DocumentResult } from "../types/mongoose";
export interface IJob extends DocumentResult<IJob> {
    title: string;
    workTime: string;
    place: string;
    updatedFromUser: boolean;
    salary: string;
    pay: string;
    date: string;
    images: any;
    detailcontent: string;
    workCategory: [string];
    isShortJob: boolean;
    jobOfferer: ObjectId;
}
const jobSchema = new Schema<IJob>({
    title: {
        type: String,
        required: true
    },
    place:  {
        type: String,
        required: true
    },
    updatedFromUser: {
        type: Boolean,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    pay: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    detailcontent: {
        type: String,
        required: true
    },
    workTime: {
        type: String,
        required: true
    },
    workCategory: {
        type: [String],
        required: true
    },
    isShortJob: {
        type: Boolean,
        required: true
    },
    jobOfferer: {
        type: Types.ObjectId,
        ref: 'User'
    }
})
export default model('JobsGQL', jobSchema);