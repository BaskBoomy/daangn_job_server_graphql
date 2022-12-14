import { Schema, Types, model } from "mongoose";
const ApplySchema = new Schema({
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
export default model("Apply", ApplySchema);
