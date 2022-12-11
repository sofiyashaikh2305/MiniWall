//Import the Libraries
const express = require('express')
const router = express.Router()

const userModel = require('../models/User')
const postModel = require('../models/Post')

const verifyToken = require('../verifyToken')

//---POST (Create New Comment)
router.post('/comment/:postID',verifyToken ,async(req, res)=> {

   const currentPostID = await postModel.findOne({ _id: req.params.postID });
   const commenterID = (JSON.stringify(currentPostID.user_id ))

   const loggeduser = await userModel.findOne({ _id: req.user._id });
   const loggedUserID = (JSON.stringify(loggeduser._id))

   let comments = currentPostID.Comment;
 
   comments.push({
     comment: req.body.comment,
     timestamp: new Date().getTime(),
     user_id: loggeduser._id,
   });

   if (commenterID === loggedUserID) {
      res.send({ message: "Unable to Comment your own Post" });
   } else {
      postModel.findByIdAndUpdate(
         req.params.postID,{
           Comment: comments,
         },
         { new: true },
         function (err, data) {
           if (err) {
             res.send(err);
           }
           res.send({ message: "Commented on Post successfully" });
         }
       );
      }
 });

//---GET (Fetch all the data)
router.get('/', async(req, res) => {
    try{
       const getComment = await postModel.find()
       res.send(getComment)
    }catch(err){
       res.send({message:err})   //error message will be in JSON format
    }
 })

//---PATCH (Update comment by ID) ------------------------Not Done
router.patch('/:postId', verifyToken, async(req, res)=> {
   //try to insert...
   try{
      const updatePostById = await Post.updateOne(
          {_id:req.params.postId},
          {$set:{
            Comment: comments,
              }
          })
      res.send(updatePostById)
  }catch(err){
      res.send({message:err})
  }
})

 //---DELETTE (Delete comment by ID ) -------------------------> Not done
 router.delete('/:postId', async(req,res)=>{

   try {
      postModel.findById(req.params.postId, async function (err, post) {
        const userobj = await userModel.findOne({ _id: req.user._id });
  
        if (post.User == userobj.username) {
          await postModel.deleteOne({ _id: req.params.postId });
  
          res.send({ message: "Selected post deleted successfully" });
        } else {
          res.send({ message: "You are not authorised to delete" });
        }
      });
    } catch (err) {
      res.send({ message: err });
    }
 })

//Dislike
 router.patch("/like/:postId", verifyToken, async function (req, res) {

   const currentPostID = await postModel.findOne({ _id: req.params.postId });
 
   const loggeduser = await userModel.findOne({ _id: req.user._id });
 
   if (currentPostID.User != loggeduser.username) {
      postModel.findByIdAndUpdate(
       req.params.postId,
       { like: currentPostID.like + 1 },
       { new: true },
       function (err, data) {
         if (err) {
           res.send(err);
         }
 
         res.send({ message: "You Liked the Post successfully" });
       }
     );
   } else {
     res.send({ message: "Unable to Like your Post" });
   }
 });

//Dislike
 router.patch("/unlike/:postID", verifyToken, async function (req, res) {
   const currentPostID = await postModel.findOne({ _id: req.params.postID });
   const commenterID = (JSON.stringify(currentPostID.user_id ))

   const loggeduser = await userModel.findOne({ _id: req.user._id });
   const loggedUserID = (JSON.stringify(loggeduser._id))

 
   if (commenterID != loggedUserID) {
      postModel.findByIdAndUpdate(
       req.params.postId,
       { Like: currentPost.Like - 1 },
       { new: true },
       function (err, data) {
         if (err) {
           res.send(err);
         }
 
         res.send({ message: req.params.postId + "Unlike Post successfull" });
       }
     );
   } else {
     res.send({ message: "Unable to Unlike your Post" });
   }
 });


 module.exports = router