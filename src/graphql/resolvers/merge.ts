import DataLoader from "dataLoader";

import User, { IUser } from "../../models/user.js"; 
import {dateToString} from "../../helpers/date.js";
import { ObjectId } from "mongoose";
import { IJob } from "../../models/job.js";
import { Job, User as UserType } from "../../../gql-types.js";
import JobModel from "../../models/job.js";
import { IApply } from "../../models/apply.js";
import { ILike } from "../../models/like.js";
/*
fetch the user for every single event and make an extra request 
instead
data loader intelligently merges this together on the back end and
makes one combined request to Users collection gets all the user IDs and
returns them back to the functions that originaly wanted them

*/
const jobLoader = new DataLoader<string, (Job | undefined)>((jobIds)=>{
    return jobs(jobIds as [string]);
})

const userLoader = new DataLoader<string, (IUser| undefined)>((userIds)=>{
    return User.find({_id: {$in: userIds}});
})

export const jobs = async (jobIds:[string]) => {
    try {
        const jobs = await JobModel.find({ _id: { $in: jobIds } });
        jobLoader.clearAll();
        jobs.sort((a:IJob,b:IJob)=>{
            return jobIds.indexOf(a._id.toString()) - jobIds.indexOf(b._id.toString())
        })
        return jobs.map(transformJob);
    } catch (err) {
        console.log(err);
        throw (err)
    }

}

export const singleJob = async (jobId:ObjectId) => {
    try {
        const job = await jobLoader.load(jobId.toString());
        return job;
    }catch(err){
        throw err;
    }
}

export const user = async (userId:ObjectId | string) => {
    try {
        const user = await userLoader.load(userId.toString());
        userLoader.clearAll();
        return {
            ...user!._doc,
            _id: user!.id,
            createdJobs: jobs.bind(this, user!._doc.createdJobs as [string]),
            appliedJobs: jobs.bind(this, user!._doc.appliedJobs as [string]),
            likedJobs:   jobs.bind(this, user!._doc.likedJobs as [string])
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export const transformJob = (job:IJob):Job=> {
    return {
        ...job._doc,
        _id: job.id as unknown as ObjectId,
        jobOfferer: user.bind(this, job.jobOfferer) // user(job을 생성한 userId) 함수 바인딩
    }
}
export const transformApplyOrLike = (result:IApply|ILike) => {
    return {
        ...result._doc,
        _id: result.id,
        user: user.bind(this, result._doc.user),
        job: singleJob.bind(this, result._doc.job as ObjectId),
        createdAt: dateToString(result._doc.createdAt),
        updatedAt: dateToString(result._doc.updatedAt),
    }
}