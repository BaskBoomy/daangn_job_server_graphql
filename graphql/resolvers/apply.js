const Apply = require("../../models/apply.js");
const Job = require("../../models/job.js");
const { transformApply, transformJob } = require("./merge.js");

module.exports = {
    applys: async (args,req) => {
        if(!req.isAuth){
            throw new Error("Authenticated Error");
        }
        try{
            const applys = await Apply.find();
            return applys.map(transformApply)
        }catch(err){
            throw err;
        }
    },
    applyJob: async (args,req) => {
        if(!req.isAuth){
            throw new Error("Authenticated Error");
        }
        try{
            const job = await Job.findOne({_id:args.jobId});
            const isApplied = await Apply.findOne({job:job,user:req.userId});
            if(isApplied){
                throw new Error("You have already applied this job");
            }
            const apply = new Apply({
                job: job,
                user:req.userId
            });

            const result = await apply.save();
            return transformApply(result);
        }catch(err){
            throw err;
        }
    },
    cancelApply: async (args,req) => {
        if(!req.isAuth){
            throw new Error("Authenticated Error");
        }
        try{
            const apply = await Apply.findById(args.applyId).populate('job');
            if(!apply){
                throw new Error("Apply is not exist");
            }
            const job = transformJob(apply.job);
            await Apply.deleteOne({_id: args.applyId});
            return job;
        }catch(err){
            throw err;
        }
    }
}