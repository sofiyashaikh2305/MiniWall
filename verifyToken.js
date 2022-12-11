const { send } = require('express/lib/response')
require('dotenv')
const jsonwebtoken = require('jsonwebtoken')

const UserModel = require('../MiniWall/models/User')

async function  auth(req, res, next){
    const token = req.header('auth-token')
        if(!token){
        return res.status(401).send({message:'Access Denied'})
    }

    try{
        const verified = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
        req.user = verified
        
        var userDetails = JSON.stringify(verified)
        // console.log( userDetails + "Currentuser is here")

        const currentUser = await UserModel.findById(userDetails._id)
        // console.log( currentUser + "Currentuser is here")
        next()
    }catch(err){
        return res.status(401).send(err)
    }
}

module.exports = auth
