import { RootMutationCreateJobArgs, RootMutationDeleteJobArgs } from "../../../gql-types";
import { RequestWithAuth } from "../../types/auth";
import Job from "../../models/job.js";
import User from "../../models/user.js";
import {transformJob} from "./merge.js";

const jobResolver = {
    jobs: async () => {
        try {
            const jobs = await Job.find();
            return jobs.map(transformJob); //db요청 모아서 한번에 처리 -> data loader api 사용
        } catch (err) {
            console.log(err);
            throw err;
        };
    },
    createJob: async ({jobInput}:RootMutationCreateJobArgs, req:RequestWithAuth) => {
        if(!req.isAuth){
            throw new Error("Authenticated Error");
        }
        const job = new Job({
            title: jobInput!.title,
            place: jobInput!.place,
            updatedFromUser: jobInput!.updatedFromUser,
            salary: jobInput!.salary,
            pay: jobInput!.pay,
            date: jobInput!.date,
            time: jobInput!.time,
            images: jobInput!.images,
            detailcontent: jobInput!.detailcontent,
            workCategory: jobInput!.workCategory,
            isShortJob: jobInput!.isShortJob,
            jobOfferer: req.userId
        })

        let createdJob;
        try {
            const result = await job.save();
            createdJob = transformJob(result);

            const isExistUser = await User.findById(req.userId)
            if (!isExistUser) {
                throw new Error('User is not exists');
            }

            isExistUser.createdJobs.push(job._id);
            await isExistUser.save();
            return createdJob;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    deleteJob: async ({jobId}:RootMutationDeleteJobArgs) =>{
        try{
            const job = await Job.findById(jobId);
            if(!job){
                throw new Error("Job is not exist");
            }
            await Job.deleteOne({_id:jobId});
            return job;
        }catch(err){
            throw err;
        }
    }
}
export default jobResolver;