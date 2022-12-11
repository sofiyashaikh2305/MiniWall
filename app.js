// Import Libraries
const express = require('express')
const app = express()
const mongoose = require('mongoose')

require('dotenv').config()  
const Murl = process.env.DB_CONNECTOR

//Import Middleware
const bodyParser = require('body-parser')

//Importing Routes
const postRoute = require('./routes/posts')
const authRoute = require('./routes/auth')
const likeCommentRoute = require('./routes/likeComment')


app.use(bodyParser. json())
app.use('/posts', postRoute) //Post - Create, Update, Delete, Read
app.use('/user', authRoute) //
app.use('/', likeCommentRoute) // comments and likes


//Create a route
app.get('/', (req,res)=>{
    res.send('Homepage')
})

//Connecting Database
mongoose.connect(Murl,()=>{
    console.log('Your MongoDB connector is on...') //callback to confirm db is connected
})

// Start Server
app.listen(3002, ()=>{
    console.log('Your server is up and running...')
})