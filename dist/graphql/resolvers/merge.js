import DataLoader from "dataLoader";
import User from "../../models/user.js";
import { dateToString } from "../../helpers/date.js";
import JobModel from "../../models/job.js";
/*
fetch the user for every single event and make an extra request
instead
data loader intelligently merges this together on the back end and
makes one combined request to Users collection gets all the user IDs and
returns them back to the functions that originaly wanted them

*/
const jobLoader = new DataLoader((jobIds) => {
    return jobs(jobIds);
});
const userLoader = new DataLoader((userIds) => {
    return User.find({ _id: { $in: userIds } });
});
export const jobs = async (jobIds) => {
    try {
        const jobs = await JobModel.find({ _id: { $in: jobIds } });
        jobLoader.clearAll();
        jobs.sort((a, b) => {
            return jobIds.indexOf(a._id.toString()) - jobIds.indexOf(b._id.toString());
        });
        return jobs.map(transformJob);
    }
    catch (err) {
        console.log(err);
        throw (err);
    }
};
export const singleJob = async (jobId) => {
    try {
        const job = await jobLoader.load(jobId.toString());
        return job;
    }
    catch (err) {
        throw err;
    }
};
export const user = async (userId) => {
    try {
        const user = await userLoader.load(userId.toString());
        userLoader.clearAll();
        return Object.assign(Object.assign({}, user._doc), { _id: user.id, createdJobs: jobs.bind(this, user._doc.createdJobs), appliedJobs: jobs.bind(this, user._doc.appliedJobs), likedJobs: jobs.bind(this, user._doc.likedJobs) });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
export const transformJob = (job) => {
    return Object.assign(Object.assign({}, job._doc), { _id: job.id, jobOfferer: user.bind(this, job.jobOfferer) // user(job을 생성한 userId) 함수 바인딩
     });
};
export const transformApplyOrLike = (result) => {
    return Object.assign(Object.assign({}, result._doc), { _id: result.id, user: user.bind(this, result._doc.user), job: singleJob.bind(this, result._doc.job), createdAt: dateToString(result._doc.createdAt), updatedAt: dateToString(result._doc.updatedAt) });
};
export const transformUser = (user) => {
    // return {
    //     ...user._doc,
    //     _id: user.id,
    // }
};
