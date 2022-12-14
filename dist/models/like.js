import { Schema, Types, model } from "mongoose";
const LikeSchema = new Schema({
    job: {
        type: Types.ObjectId,
        ref: "JobsGQL"
    },
    user: {
        type: Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});
export default model("Like", LikeSchema);
