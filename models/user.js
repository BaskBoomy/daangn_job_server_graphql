const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
	phoneNumber: {
        type: String,
        required: true,
    },  
	nickname: {
        type: String,
        required: true,
    },
	borndate:  {
        type: String,
    },
	gender:  {
        type: String,
    },
	name:  {
        type: String,
    },
	selfIntroduction:  {
        type: String,
    },
	careers :  {
        type: [],
    },
    createdEvents: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }
    ]
})

module.exports = mongoose.model('User', userSchema);