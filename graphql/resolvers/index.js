const Job = require("../../models/job.js");
const User = require("../../models/user.js");

const jobs = async jobIds => {
    try {
        const jobs = await Job.find({ _id: { $in: jobIds } });
        return jobs.map(job => {
            return {
                ...job._doc,
                _id: job.id,
                jobOfferer: user.bind(this, job.jobOfferer)
            };
        });
    } catch (err) {
        console.log(err);
        throw (err)
    }

}
const user = async userId => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            _id: user.id,
            createdJobs: jobs.bind(this, user._doc.createdJobs)
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
}
module.exports = {
    jobs: async () => {
        try {
            const jobs = await Job.find();
            return jobs.map(job => {
                return {
                    ...job._doc,
                    _id: job.id,
                    jobOfferer: user.bind(this, job._doc.jobOfferer)
                };
            });
        } catch (err) {
            console.log(err);
            throw err;
        };
    },
    createJob: async args => {
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
            jobOfferer: '63980f7f9a60569d98a73040'
        })

        let createdJob;
        try {
            const result = await job.save();
            createdJob = {
                ...result,
                _id: job._id.toString(),
                jobOfferer: user.bind(result.jobOfferer)
            };

            const isExistUser = await User.findById('63980f7f9a60569d98a73040')
            if (!isExistUser) {
                throw new Error('User is not exists');
            }
            console.log(isExistUser);

            isExistUser.createdJobs.push(job);
            await isExistUser.save();
            return createdJob;
        } catch (err) {
            console.log(err);
            throw err;
        }

    },
    createUser: async args => {
        try {
            const userIsExist = await User.findOne({ phoneNumber: args.userInput.phoneNumber })
            if (userIsExist) {
                throw new Error('User exists already');
            }

            const user = new User({
                phoneNumber: args.userInput.phoneNumber,
                nickname: args.userInput.nickname
            });
            const result = await user.save();
            return { ...result._doc, _id: result.id }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}