import { ObjectId,Schema, Types, model } from "mongoose";
import { DocumentResult } from "../types/mongoose";
import { IJob } from "./job";

export interface ILike extends DocumentResult<ILike> {
    job: ObjectId | IJob;
    user: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
const LikeSchema = new Schema<ILike>({
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

export default model("Like", LikeSchema);