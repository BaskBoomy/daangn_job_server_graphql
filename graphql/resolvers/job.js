const Job = require("../../models/job.js");
const User = require("../../models/user.js");
const {transformJob} = require("./merge.js");
module.exports = {
    jobs: async () => {
        try {
            const jobs = await Job.find();
            return jobs.map(transformJob); //db요청 모아서 한번에 처리 -> data loader api 사용
        } catch (err) {
            console.log(err);
            throw err;
        };
    },
    createJob: async (args, req) => {
        if(!req.isAuth){
            throw new Error("Authenticated Error");
        }
        const job = new Job({
            title: args.jobInput.title,
            place: args.jobInput.place,
            updatedFromUser: args.jobInput.updatedFromUser,
            salary: args.jobInput.salary,
            pay: args.jobInput.pay,
            date: args.jobInput.date,
            time: args.jobInput.time,
            images: args.jobInput.images,
            detailcontent: args.jobInput.detailcontent,
            workCategory: args.jobInput.workCategory,
            isShortJob: args.jobInput.isShortJob,
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

            isExistUser.createdJobs.push(job);
            await isExistUser.save();
            return createdJob;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    deleteJob: async (args, req) =>{
        try{
            const job = await Job.findById(args.jobId);
            if(!job){
                throw new Error("Job is not exist");
            }
            await Job.deleteOne({_id:args.jobId});
            return job;
        }catch(err){
            throw err;
        }
    }
}