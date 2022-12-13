const DataLoader = require("dataLoader");

const Job = require("../../models/job.js"); 
const User = require("../../models/user.js"); 
const {dateToString} = require("../../helpers/date.js");
/*
fetch the user for every single event and make an extra request 
instead
data loader intelligently merges this together on the back end and
makes one combined request to Users collection gets all the user IDs and
returns them back to the functions that originaly wanted them

*/
const jobLoader = new DataLoader((jobIds)=>{
    return jobs(jobIds);
})

const userLoader = new DataLoader((userIds)=>{
    return User.find({_id: {$in: userIds}});
})

const jobs = async jobIds => {
    try {
        const jobs = await Job.find({ _id: { $in: jobIds } });
        //
        jobs.sort((a,b)=>{
            return jobIds.indexOf(a._id.toString()) - jobIds.indexOf(b._id.toString())
        })
        // console.log(jobs, jobIds);
        return jobs.map(transformJob);
    } catch (err) {
        console.log(err);
        throw (err)
    }

}

const singleJob = async jobId => {
    try {
        const job = await jobLoader.load(jobId.toString());
        jobLoader.clearAll();
        return job;
    }catch(err){
        throw err;
    }
}

const user = async (userId) => {
    try {
        const user = await userLoader.load(userId.toString());
        userLoader.clearAll();
        return {
            ...user._doc,
            _id: user.id,
            createdJobs: () => jobLoader.loadMany(user._doc.createdJobs)
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const transformJob = job => {
    return {
        ...job._doc,
        _id: job.id,
        jobOfferer: user.bind(this, job.jobOfferer) // user(job을 생성한 userId) 함수 바인딩
    }
}
const transformApply = apply => {
    return {
        ...apply._doc,
        _id: apply.id,
        user: user.bind(this, apply._doc.user),
        job: singleJob.bind(this, apply._doc.job),
        createdAt: dateToString(apply._doc.createdAt),
        updatedAt: dateToString(apply._doc.updatedAt),
    }
}
exports.transformJob = transformJob;
exports.transformApply = transformApply;
exports.user = user;
exports.jobs = jobs;
exports.singleJob = singleJob;