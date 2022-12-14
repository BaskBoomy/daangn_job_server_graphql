var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Apply from "../../models/apply.js";
import Job from "../../models/job.js";
import { transformApplyOrLike, transformJob } from "./merge.js";
const applyResolvers = {
    applys: (args, req) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuth) {
            throw new Error("Authenticated Error");
        }
        try {
            const applys = yield Apply.find();
            return applys.map(transformApplyOrLike);
        }
        catch (err) {
            throw err;
        }
    }),
    applyJob: ({ jobId }, req) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuth) {
            throw new Error("Authenticated Error");
        }
        try {
            const job = yield Job.findOne({ _id: jobId });
            const isApplied = yield Apply.findOne({ job: job, user: req.userId });
            if (isApplied) {
                throw new Error("You have already applied this job");
            }
            const apply = new Apply({
                job: job,
                user: req.userId
            });
            const result = yield apply.save();
            return transformApplyOrLike(result);
        }
        catch (err) {
            throw err;
        }
    }),
    cancelApply: ({ applyId }, req) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuth) {
            throw new Error("Authenticated Error");
        }
        try {
            const apply = yield Apply.findById(applyId).populate('job');
            if (!apply) {
                throw new Error("Apply is not exist");
            }
            const job = transformJob(apply.job);
            yield Apply.deleteOne({ _id: applyId });
            return job;
        }
        catch (err) {
            throw err;
        }
    })
};
export default applyResolvers;
