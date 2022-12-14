import { ObjectId,Schema, Types, model } from "mongoose";
import { DocumentResult } from "../types/mongoose";
import { IJob } from "./job";

export interface IApply extends DocumentResult<IApply> {
    job: ObjectId | IJob;
    user: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
const ApplySchema = new Schema<IApply>({
    job:{
        type:Types.ObjectId,
        ref:"JobsGQL"
    },
    user:{
        type:Types.ObjectId,
        ref:"User"
    }
},{
    timestamps:true
})

export default model("Apply", ApplySchema);