// Import the Libraries
const mongoose = require('mongoose')
const Schema = mongoose.Schema;


//Created Schema for likes and comments on post
const commentLikeSchema = Schema({
    comment:{
        type:String,
        required:true
    },
    like:{
        type:Number,
        default:0
    },
    post_id:{
        type: Schema.Types.ObjectId, ref: 'posts'
    },
    user_id:{
        type: Schema.Types.ObjectId, ref: 'user'
    },
    timestamp:{
        type:Date,
        default:Date.now
    }
})

//Export the post
module.exports = mongoose.model('comments', commentLikeSchema)