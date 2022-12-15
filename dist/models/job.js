import { Schema, Types, model } from "mongoose";
const jobSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    place: {
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
});
export default model('JobsGQL', jobSchema);
