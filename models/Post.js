// Import the Libraries
const mongoose = require('mongoose')
// const commentLikeModel = require('../models/CommentLike').schema
const Schema = mongoose.Schema;

// const userModel = require('../models/User')

//Created Schema for post
const PostSchema = Schema({
    post_title:{
        type:String,
        required:true,
        min:3,
        max:500
    },
    post_description:{
        type:String,
        required:true,
        min:3,
        max:500
    },
    timestamp:{
        type:Date,
        default:Date.now
    },
    user_id:{
        type: Schema.Types.ObjectId, ref: 'user'
    },
    like: {
        type: Number,
        default: 0,
      },
      Comment: [
        {
            comment: {
            type: String,
          },
    
          timestamp: {
            type: String,
          },
    
          user_id: {
            type: String,
          },
        },
      ],
    // commentsLikes: [commentLikeModel]      
})

//Export the post
module.exports = mongoose.model('posts', PostSchema)




