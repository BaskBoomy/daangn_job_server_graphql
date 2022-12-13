const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ApplySchema = new Schema({
    job:{
        type:mongoose.Types.ObjectId,
        ref:"JobsGQL"
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    }
},{
    timestamps:true
})

module.exports = mongoose.model("Apply", ApplySchema);