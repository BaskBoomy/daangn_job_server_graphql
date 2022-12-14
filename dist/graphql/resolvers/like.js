var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Like from "../../models/like.js";
import Job from "../../models/job.js";
import { transformApplyOrLike, transformJob } from "./merge.js";
const likeResolvers = {
    likeJob: ({ jobId }, req) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuth) {
            throw new Error("Authenticated Error");
        }
        try {
            const job = yield Job.findOne({ _id: jobId });
            if (!job) {
                throw new Error("Job is not exist");
            }
            const isLiked = yield Like.findOne({ job: job, user: req.userId });
            if (isLiked) {
                throw new Error("You have already liked this job");
            }
            const like = new Like({
                job: jobId,
                user: req.userId
            });
            const result = yield like.save();
            return transformApplyOrLike(result);
        }
        catch (err) {
            throw err;
        }
    }),
    unLikeJob: ({ jobId }, req) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuth) {
            throw new Error("Authenticated Error");
        }
        try {
            const like = yield Like.findOne({ jobId: jobId }).populate('job');
            if (!like) {
                throw new Error("You did not like this job");
            }
            const job = transformJob(like.job);
            yield Like.deleteOne({ jobId: jobId });
            return job;
        }
        catch (err) {
            throw err;
        }
    })
};
export default likeResolvers;
