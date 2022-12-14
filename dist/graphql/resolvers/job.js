var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Job from "../../models/job.js";
import User from "../../models/user.js";
import { transformJob } from "./merge.js";
const jobResolver = {
    jobs: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const jobs = yield Job.find();
            return jobs.map(transformJob); //db요청 모아서 한번에 처리 -> data loader api 사용
        }
        catch (err) {
            console.log(err);
            throw err;
        }
        ;
    }),
    createJob: ({ jobInput }, req) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuth) {
            throw new Error("Authenticated Error");
        }
        const job = new Job({
            title: jobInput.title,
            place: jobInput.place,
            updatedFromUser: jobInput.updatedFromUser,
            salary: jobInput.salary,
            pay: jobInput.pay,
            date: jobInput.date,
            time: jobInput.time,
            images: jobInput.images,
            detailcontent: jobInput.detailcontent,
            workCategory: jobInput.workCategory,
            isShortJob: jobInput.isShortJob,
            jobOfferer: req.userId
        });
        let createdJob;
        try {
            const result = yield job.save();
            createdJob = transformJob(result);
            const isExistUser = yield User.findById(req.userId);
            if (!isExistUser) {
                throw new Error('User is not exists');
            }
            isExistUser.createdJobs.push(job._id);
            yield isExistUser.save();
            return createdJob;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }),
    deleteJob: ({ jobId }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const job = yield Job.findById(jobId);
            if (!job) {
                throw new Error("Job is not exist");
            }
            yield Job.deleteOne({ _id: jobId });
            return job;
        }
        catch (err) {
            throw err;
        }
    })
};
export default jobResolver;
