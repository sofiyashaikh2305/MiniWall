//Importing models
const express =require('express')
const router = express.Router()
const User = require('../models/User')

const Post = require('../models/Post')
const verifyToken = require('../verifyToken')

// Inserting Data
router.post('/', verifyToken, async(req,res)=>{

    const postData = new Post({
        owner:req.body.owner,
        title:req.body.title,
        description:req.body.description
    })
    
    try{
        const postToSave = await postData.save()
        res.send(postToSave)
    }catch(err){
        res.send({message:err})
    }
})

// Getting all comments
router.get("/", verifyToken, async (req, res) => {
    try {
      const getPosts = await Post.find();
  
      let postsWithLikes = [];
  
      let postWithoutLikes = [];
  
      //seperating post with and without likes
  
      getPosts.forEach((post) => {
        if (post.Like > 0) {
          postsWithLikes.push(post);
        } else {
          postWithoutLikes.push(post);
        }
      });
  
      //Sorting Post with likes by number of Likes
  
      const SortPostWithLikes = postsWithLikes.sort((a, b) => {
        const d1 = a.Like;
  
        const d2 = b.Like;
  
        if (d1 < d2) return 1;
  
        if (d1 > d2) return -1;
  
        if (d1 === d2) return 0;
  
        return NaN;
      });
  
      //Sorting Post Without Likes by post time
  
      const SortPostWithoutLikes = postWithoutLikes.sort((a, b) => {
        const d1 = a.Date;
  
        const d2 = b.Date;
  
        if (d1 < d2) return 1;
  
        if (d1 > d2) return -1;
  
        if (d1 === d2) return 0;
  
        return NaN;
      });
  
      let SortedPosts = [];
  
      SortedPosts.push(SortPostWithLikes);
  
      SortedPosts.push(SortPostWithoutLikes);
  
      res.send(SortedPosts);
    } catch (err) {
      res.send({ message: err });
    }
  });
  
  //GET (ii)- (Read post by ID)
  
  router.get("/:postId", verifyToken, async (req, res) => {
    try {
      const getPostById = await Post.findById(req.params.postId); //read by Id
  
      res.send(getPostById);
    } catch (err) {
      res.send({ message: err });
    }
  });
  
  //3. PATCH(Update the post)
  
  //get postId from user and match it with postId of database, and then update the data
  
  router.patch("/:postId", verifyToken, async (req, res) => {
    try {
      Post.findById(req.params.postId, async function (err, post) {
        const userobj = await User.findOne({ _id: req.user._id });
  
        if (post.User == userobj.username) {
          const updatePostById = await Post.updateOne(
            { _id: req.params.postId },
  
            {
              $set: {
                User: req.body.User,
                Title: req.body.Title,
                Description: req.body.Description
              },
            }
          );
  
          res.send({ message: updatePostById + " Post Edited successfully" });
        } else {
          res.send({ message: "You are not authorised to edit" });
        }
      });
    } catch (err) {
      res.send({ message: err });
    }
  });

// Getting comments by Id
router.get('/:postId', verifyToken, async(req,res) =>{
    try{
        const getPostById = await Post.findById(req.params.postId)
        res.send(getPostById)
    }catch(err){
        res.send({message:err})
    }
})

// Updating comments
router.patch('/:postId',verifyToken, async(req,res) =>{
    try{
        const updatePostById = await Post.updateOne(
            {_id:req.params.postId},
            {$set:{
                owner:req.body.owner,
                title:req.body.title,
                description:req.body.description
                }
            })
        res.send(updatePostById)
    }catch(err){
        res.send({message:err})
    }
})

// Deleting Comments
router.delete("/:postId", verifyToken, async (req, res) => {
    try {
      Post.findById(req.params.postId, async function (err, post) {
        const userobj = await User.findOne({ _id: req.user._id });
  
        if (post.User == userobj.username) {
          await Post.deleteOne({ _id: req.params.postId });
  
          res.send({ message: "Selected post deleted successfully" });
        } else {
          res.send({ message: "You are not authorised to delete" });
        }
      });
    } catch (err) {
      res.send({ message: err });
    }
});

//Like functionality

router.patch("/like/:postId", verifyToken, async function (req, res) {
    const currentPost = await Post.findOne({ _id: req.params.postId });
  
    const loggeduserobj = await User.findOne({ _id: req.userExists._id });
  
    if (currentPost.User != loggeduserobj.username) {
      Post.findByIdAndUpdate(
        req.params.postId,
        { Like: currentPost.Like + 1 },
        { new: true },
        function (err, data) {
          if (err) {
            res.send(err);
          }
  
          res.send({ message: req.params.postId + " Post Liked successfully" });
        }
      );
    } else {
      res.send({ message: " Unable to Like your Post" });
    }
  });
  
  //Dislike functionality
  
  router.patch("/unlike/:postId", verifyToken, async function (req, res) {
    const currentPost = await Post.findOne({ _id: req.params.postId });
  
    const loggeduserobj = await User.findOne({ _id: req.userExists._id });
  
    if (currentPost.User != loggeduserobj.username) {
      Post.findByIdAndUpdate(
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
  
  //Commenting on a Post
  router.put("/comment/:postId", verifyToken, async function (req, res) {
    const currentPost = await Post.findOne({ _id: req.params.postId });
  
    const loggeduserobj = await User.findOne({ _id: req.userExists._id });
  
    let comments = currentPost.Comment;
  
    comments.push({
      CommentInfo: req.body.CommentInfo,
  
      CommentTime: new Date().getTime(),
  
      CommentOwner: loggeduserobj.username,
    });
  
    if (currentPost.User != loggeduserobj.username) {
      Post.findByIdAndUpdate(
        req.params.postId,
  
        {
          Comment: comments,
        },
  
        { new: true },
  
        function (err, data) {
          if (err) {
            res.send(err);
          }
  
          res.send({ message: currentPost._id + " Comment Post successfull" });
        }
      );
    } else {
      res.send({ message: "Unable to Comment your own Post" });
    }
  });

module.exports = router