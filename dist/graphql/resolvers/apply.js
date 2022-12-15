import Apply from "../../models/apply.js";
import Job from "../../models/job.js";
import User from "../../models/user.js";
import { transformApplyOrLike, transformJob } from "./merge.js";
const applyResolvers = {
    applys: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("Authenticated Error");
        }
        try {
            const applys = await Apply.find();
            return applys.map(transformApplyOrLike);
        }
        catch (err) {
            throw err;
        }
    },
    applyJob: async ({ jobId }, req) => {
        if (!req.isAuth) {
            throw new Error("Authenticated Error");
        }
        try {
            const job = await Job.findOne({ _id: jobId });
            const isApplied = await Apply.findOne({ job: job, user: req.userId });
            if (isApplied) {
                throw new Error("You have already applied this job");
            }
            const isExistUser = await User.findById(req.userId);
            if (!isExistUser) {
                throw new Error('User is not exists');
            }
            isExistUser.appliedJobs.push(jobId);
            await isExistUser.save();
            const apply = new Apply({
                job: job,
                user: req.userId
            });
            const result = await apply.save();
            return transformApplyOrLike(result);
        }
        catch (err) {
            throw err;
        }
    },
    cancelApply: async ({ applyId }, req) => {
        if (!req.isAuth) {
            throw new Error("Authenticated Error");
        }
        try {
            const apply = await Apply.findById(applyId).populate('job');
            if (!apply) {
                throw new Error("Apply is not exist");
            }
            const job = transformJob(apply.job);
            await Apply.deleteOne({ _id: applyId });
            return job;
        }
        catch (err) {
            throw err;
        }
    }
};
export default applyResolvers;
