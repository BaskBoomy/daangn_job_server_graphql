const Event = require("../../models/event.js");
const User = require("../../models/user.js");

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
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
            createdEvents: events.bind(this, user._doc.createdEvents)
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
}
module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return {
                    ...event._doc,
                    _id: event.id,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                };
            });
        } catch (err) {
            console.log(err);
            throw err;
        };
    },
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '639754d94e76ba839166c910'
        })

        let createdEvent;
        try {
            const result = await event.save();
            createdEvent = {
                ...result._doc,
                _id: event._doc._id.toString(),
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this.result._doc.creator)
            };

            const isExistUser = await User.findById('639754d94e76ba839166c910')
            if (!isExistUser) {
                throw new Error('User is not exists');
            }

            isExistUser.createdEvents.push(event);
            await isExistUser.save();
            return createdEvent;
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
                nickname: args.userInput.nickname,
            });
            const result = await user.save();
            return { ...result._doc, _id: result.id }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}