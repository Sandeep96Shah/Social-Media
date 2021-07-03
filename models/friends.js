const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    friends:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"User"
        }
    ]
},{
    timestamps:true
})

const Friend = mongoose.model("Friend",friendSchema);

module.exports = Friend;