import Like from "../../models/like.js";
import Job from "../../models/job.js";
import { transformApplyOrLike, transformJob } from "./merge.js";
import User from "../../models/user.js";
const likeResolvers = {
    likeJob: async ({ jobId }, req) => {
        if (!req.isAuth) {
            throw new Error("Authenticated Error");
        }
        try {
            const job = await Job.findOne({ _id: jobId });
            if (!job) {
                throw new Error("Job is not exist");
            }
            const isLiked = await Like.findOne({ job: job, user: req.userId });
            if (isLiked) {
                throw new Error("You have already liked this job");
            }
            const isExistUser = await User.findById(req.userId);
            if (!isExistUser) {
                throw new Error('User is not exists');
            }
            isExistUser.likedJobs.push(jobId);
            await isExistUser.save();
            const like = new Like({
                job: jobId,
                user: req.userId
            });
            const result = await like.save();
            return transformApplyOrLike(result);
        }
        catch (err) {
            throw err;
        }
    },
    unLikeJob: async ({ jobId }, req) => {
        if (!req.isAuth) {
            throw new Error("Authenticated Error");
        }
        try {
            const like = await Like.findOne({ jobId: jobId }).populate('job');
            if (!like) {
                throw new Error("You did not like this job");
            }
            const job = transformJob(like.job);
            await Like.deleteOne({ jobId: jobId });
            return job;
        }
        catch (err) {
            throw err;
        }
    }
};
export default likeResolvers;
