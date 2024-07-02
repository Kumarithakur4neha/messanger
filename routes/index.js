var express = require('express');
var router = express.Router();

const passport=require("passport")
const userModel=require("../models/schema")
const LocalStrategy=require("passport-local")
passport.use(new LocalStrategy(userModel.authenticate()));

const messageModel = require('../models/message')



/* GET home page. */
router.get('/',function(req, res, next) {
  const user=req.user
  res.render('index', { title: 'Express' });
});

router.get("/chat", isloggedIn,function(req,res,next){
  res.render("message",{user:req.user})
})

router.get("/register",function(req,res,next){
  res.render("register")
})

function isloggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  else res.redirect('/login');
}

router.post("/register",function(req,res,next){
var userdata=new userModel({
  username:req.body.username,
  profileimage:req.body.profileimage
  })
userModel.register(userdata,req.body.password)
.then(function(registeredUser){
  passport.authenticate('local')(req, res, function () {
    res.redirect('/login');
  })
})
})

router.get("/login",function(req,res,next){
  res.render("login")
})

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/chat',          //
    failureRedirect: '/login',
  }),
  (req, res, next) => { }
);

router.get('/logout', (req, res, next) => {
  if (req.isAuthenticated())
    req.logout((err) => {
      if (err) res.send(err);
      else res.redirect('/chat');   //
    });
  else {
    res.redirect('/chat');   //
  }
});

router.get('/getOnlineUser', isloggedIn, async (req, res, next) => {
  const loggedInUser = req.user


  const onlineUsers = await userModel.find({
    socketId: { $ne: "" }, //not equal notonline server checks in the data base who user areonline checks online or offfline
    
    _id: { $ne: loggedInUser._id }
  })

  res.status(200).json({
    onlineUsers  //after finding users online 
  })

})

router.get("/getMessage",isloggedIn,async(req,res,next)=>{
  const sender=req.user.username
const receiver=req.query.receiver

const messages=await messageModel.find({
  $or:[{
    sender:sender,
    receiver:receiver,
  },{
    sender:receiver,
    receiver:sender
  }]
})

console.log(messages)

res.status(200).json({
  messages
})
})

module.exports = router;
                                                                  