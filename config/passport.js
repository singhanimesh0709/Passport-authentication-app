const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');// for checking database for matchhing ppasswd and username
const bcrypt = require('bcryptjs');// to use compare for password

//Load User model
const User = require('../models/User');

module.exports = function(passport){// we'll pass in passport  from app.js
   passport.use(
     new LocalStrategy({usernameField: 'email'},
     (email,password,done)=>{
      // match User
      User.findOne({email: email})
      .then((user)=>{
        if(!user){
            return done(null, false,{message: 'That email isnt registered'});
        }
     
        // Matching password
        bcrypt.compare(password,user.password,
             (err,isMatch)=>{
            if(err) throw err;

            if(isMatch){
                return done(null,user);
            }else{
                return done(null,false,{message:'Password is incorrect'});
            }
        })


      })
      .catch(err => console.log(err));
     })  
   ); 

   passport.serializeUser(function(user,done){
       done(null,user.id);
   });

   passport.deserializeUser(function(id,done){
       User.findById(id,function(err,user){
         done(err,user);
       });
   });
   
   


}