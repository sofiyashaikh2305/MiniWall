//Import the Libraries
const express = require('express')
const { updateOne } = require('../models/Post')
const router = express.Router() 

//Import Model
const postModel = require('../models/Post')
const userModel = require('../models/User')

const verifyToken = require('../verifyToken')

//---POST (Create New Post)
router.post('/', verifyToken, async(req, res)=> {
   const loggedUser = await userModel.find({_id:req.user},{_id:1});
   // console.log(loggedUser._id + " This is LoggedIn user")
   // var loggedInUser = (JSON.stringify(commenter[0].email)).slice(1, -1)
   // console.log(loggedInUser)

   const postData = new postModel({
      post_title:req.body.post_title,
      post_description:req.body.post_description,
      user_id:req.user
      })
   //try to insert...
   try{
      const savePost = await postData.save()
      res.send(savePost)
   }catch(err){   //catch the error
      res.send({message:err})    //error message will be in JSON format
   }
})

//---GET (Fetch all the Posts)
router.get('/', verifyToken, async(req, res) => {
   try {
      const getPosts = await postModel.find();
      let postsWithLikes = [];
      let postWithoutLikes = [];
  
      //Post with and without likes
      getPosts.forEach((post) => {
        if (post.like > 0) {
          postsWithLikes.push(post);
        } else {
          postWithoutLikes.push(post);
        }
      });
  
      //Filter posts with higher no. of likes
      const SortPostWithlLikes = postsWithLikes.sort((a, b) => {
        const s1 = a.like;
        const s2 = b.like;
        if (s1 < s2) return 1;
        if (s1 > s2) return -1;
        if (s1 === s2) return 0;
        return NaN;
      });
  
      //Filter posts with equal no. of likes with time
      const SortPostWithoutLikes = postWithoutLikes.sort((a, b) => {
        const s1 = a.Date;
        const s2 = b.Date;
        if (s1 < s2) return 1;
        if (s1 > s2) return -1;
        if (s1 === s2) return 0;
        return NaN;
      });
  
      let SortedPosts = [];
      SortedPosts.push(SortPostWithlLikes);
      SortedPosts.push(SortPostWithoutLikes);
      res.send(SortedPosts);

   }catch(err){
      res.send({message:err})   //error message will be in JSON format
   }
})

//---GET by ID (Fetch Post by ID)
router.get('/:postId', verifyToken, async(req, res) => {
   try{
      const getPostbyId = await postModel.findById(req.params.postId)
      res.send(getPostbyId)
   }catch(err){
      res.send({message:err})   //error message will be in JSON format
   }
})

//---PATCH (Update Post by ID)
router.patch('/:postId', verifyToken, async(req, res)=> {
   //try to insert...
   try{
      const updatePostbyId = await postModel.updateOne(
         {_id:req.params.postId},
         {$set:{
            post_title:req.body.post_title,
            post_description:req.body.post_description
            }
         })
         res.send({ message: "Your Post is Edited successfully" });
      }catch(err){   //catch the error
      res.send({message: "Sorry! You are not allowed to edit post"})    //error message will be shown
   }
})

//---DELETE (Delete Post)
router.delete('/:postId', verifyToken, async(req,res)=>{
   
   // const currentPostID = await postModel.findOne({ _id:req.params.postId });
   // console.log(currentPostID + "postid is here")
   // const commenterID = (JSON.stringify(currentPostID ))

   // const loggeduser = await userModel.findOne({ _id: req.user._id });
   // const loggedUserID = (JSON.stringify(loggeduser._id))

   // if (commenterID === loggedUserID){
   //    console.log("Deleted " + loggedUserID + commenterID)
   // }else{
   //    console.log("Cannot Delete" + loggedUserID + commenterID)
   // }
  //try to insert...
  try{
   const deletePostbyID = await postModel.deleteOne({_id:req.params.postId})
   res.send({message: "Your Post is Deleted successfully"})
  }catch{
   res.send({message: "Sorry! You cannot delete a post"})      //error message will be displayed
  }
})


//Export the routes
module.exports = router