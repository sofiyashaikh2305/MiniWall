const express = require('express')
const router = express.Router()

const userModel = require('../models/User')
const {registerValidation, loginValidation} = require('../validation/validation')

const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

const verifyToken = require('../verifyToken')

//User Registeration
router.post('/register', async(req,res)=>{

    //Validation : User input
    const {error} = registerValidation(req.body)
    if(error)
        return res.status(400).send({message:error['details'][0]['message']})

    //encrypt the user password
    const salt = await bcryptjs.genSalt(5)
    const hashpassword = await bcryptjs.hash(req.body.password,salt)

    //Validation: check if user exists
    const userExists = await userModel.findOne({email:req.body.email})
    if(userExists){
        return res.status(400).send({message:'User Already Exist'})
    }

    //Save the user data into database
    const user = new userModel({
        username: req.body.username,
        email: req.body.email,
        password: hashpassword
    })
    try{
        const userSaved = await user.save()
        res.send(userSaved)
    }catch(err){
        res.status(400).send({message:err})
    }
})

//Login
router.post('/login', async(req,res)=>{

    //Validation : User input
    const {error} = loginValidation(req.body)
    if(error)
        return res.status(400).send({message:error['details'][0]['message']})   

   //Validation: check if user exists
   const user = await userModel.findOne({email:req.body.email})
   if(!user){
       return res.status(400).send({message:'User does not Exist'})
   }

   //Validate the password
   const passwordValidation = await bcryptjs.compare(req.body.password,user.password)
   if(!passwordValidation){
    return res.status(400).send({message:'Incorrect Password'})
    }
    // res.send('You are logged In successfully!!!')

    //Generating auth-token
    const token = jsonwebtoken.sign({_id:user._id}, "" + process.env.TOKEN_SECRET)
    res.header('auth-token',token).send({'auth-token':token, message:'You are Logged In successfully'})
})

//---PATCH (Update User Profile by ID)
router.patch('/:_id', verifyToken, async(req, res)=> {
    //try to insert...
    try{
       const updateUserbyId = await userModel.updateOne(
          {_id:req.params._id},
          {$set:{
            username: req.body.username,
            email: req.body.email,
            password: hashpassword
             }
          })
          res.send({ message: "Your profile are edited successfully" });
       }catch(err){   //catch the error
       res.send({message: "Sorry! You are not allowed to edit profile"})    //error message will be shown
    }
 })

module.exports = router