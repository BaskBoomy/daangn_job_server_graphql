import { Request } from "express";
import { RootQueryJobArgs, RootQuerySearchJobArgs } from './../../../gql-types.d';
import { RootMutationCreateJobArgs, RootMutationDeleteJobArgs } from "../../../gql-types";
import Job from "../../models/job.js";
import User from "../../models/user.js";
import {transformJob, user} from "./merge.js";
import { getSearchSetting } from "../../service/search.js";

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
    createJob: async ({jobInput}:RootMutationCreateJobArgs, req:Request) => {
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
            workTime: jobInput!.workTime,
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
    },
    job: async ({jobId}:RootQueryJobArgs,req: Request) => {
        try{
            const job = await Job.findById(jobId);
            if(!job){
                throw new Error("Job is not exist");
            }
            //현재 user가 이 게시글을 좋아요 하고 있는지 확인
            const isUserLike = await User.findOne({likedJobs:jobId});
            return {
                ...job._doc,
                isUserLike: isUserLike ? true : false
            };
        }catch(err){
            throw err;
        }
    },
    searchJob: async({searchType}:RootQuerySearchJobArgs) => {
        try {
            //조건이 존재하지 않을 경우
            if (searchType == null) {
                console.log('조건을 설정해주세요.');
                
                const jobs = await Job.find();
                return jobs.map(transformJob);
            } else {
                const query = getSearchSetting(searchType);
                const pipeline = [
                    {
                        "$search": {
                            "index": "searchJobgql",
                            "compound": {
                                "must": query
                            }
                        }
                    }
                ]

                //Get Result
                return await Job
                    .aggregate(pipeline)
                    .then((result) => {
                        return result.map((data)=>{
                            return {
                                ...data,
                                jobOfferer: user.bind(this, data.jobOfferer)
                            }
                        })
                    })
                    .catch((err:any) => {
                        console.log(err);
                    })
            }
        }catch(error) {
            
        }
    }

}
export default jobResolver;