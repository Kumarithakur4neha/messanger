const mongoose=require("mongoose")

const plm=require("passport-local-mongoose")

const userschema=mongoose.Schema({
    username:String,
    password:String,
    profileimage:{
        type:String,
        default:""
    },
    socketId:String
 
})
userschema.plugin(plm)

module.exports=mongoose.model("user",userschema)