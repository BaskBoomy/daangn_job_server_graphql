import { RootMutationLikeJobArgs,RootMutationUnLikeJobArgs } from "../../../gql-types.js";
import Like from "../../models/like.js";
import Job, { IJob } from "../../models/job.js";
import { RequestWithAuth } from "../../types/auth.js";
import { transformApplyOrLike, transformJob } from "./merge.js";

const likeResolvers = {
    likeJob: async ({jobId}:RootMutationLikeJobArgs,req:RequestWithAuth) => {
        if(!req.isAuth){
            throw new Error("Authenticated Error");
        }
        
        try{
            const job = await Job.findOne({_id:jobId});
            if(!job){
                throw new Error("Job is not exist");
            }
            const isLiked = await Like.findOne({job:job,user:req.userId});
            if(isLiked){
                throw new Error("You have already liked this job");
            }
            const like = new Like({
                job: jobId,
                user:req.userId
            });

            const result = await like.save();
            return transformApplyOrLike(result);
        }catch(err){
            throw err;
        }
    },
    unLikeJob: async ({jobId}:RootMutationUnLikeJobArgs,req:RequestWithAuth) => {
        
        if(!req.isAuth){
            throw new Error("Authenticated Error");
        }
        try{
            const like = await Like.findOne({jobId:jobId}).populate<IJob>('job');
            
            if(!like){
                throw new Error("You did not like this job");
            }
            const job = transformJob(like.job as IJob);
            await Like.deleteOne({jobId:jobId});
            return job;
        }catch(err){
            throw err;
        }
    }
}
export default likeResolvers;