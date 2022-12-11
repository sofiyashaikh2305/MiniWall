// Import the Libraries
const mongoose = require('mongoose')

//Created Schema for post
const UserSchema = mongoose.Schema({
    username:{
        type:String,
        require:true,
        min:3,
        max:256
    },
    email:{
        type:String,
        require:true,
        min:6,
        max:256
    },
    password:{
        type:String,
        require:true,
        min:6,
        max:1024
    },
    timestamp:{
        type:Date,
        default:Date.now
    }
})


//Export the post
module.exports = mongoose.model('user', UserSchema)