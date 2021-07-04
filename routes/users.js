const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../models/User');

router.get('/users/login', (req,res)=>{
    res.render('login');
});
router.get('/users/register',(req,res)=>{
    res.render('register');
})

router.post('/users/register',(req,res)=>{
    const{ name, email, password, password2 } = req.body;
    let errors=[];// initializing an array called errors

//check required fields
if(!name || !email || !password || !password2){
    errors.push({ msg:'please fill all the fields'});
}

//check psswords match
if(password !== password2){
    errors.push({msg:'passwords do not match'});// hum ye har baar object bna ke msg: '.....' isliye kar rhe kyuki baad me jab meesage.ejs se forEach lagayenge tab isse call karenge.
}

//check password length
if(password.length < 6){
errors.push({msg: ' password should be atleast 6 characters'});
}

if(errors.length > 0){
res.render('register',{
    errors,
    name,
    email,
    password,
    password2
});
}else{
   //validtion passed
    User.findOne({email:email})
    .then(user=>{
       if(user){
           // User exists
           errors.push({msg:'Email is already in use'});
           res.render('register',{
            errors,
            name,
            email,
            password,  
            password2 
           });
       } else {
         const newUser = new User({
             name,
             email,
             password
         }); 
         
         // Hash password
         /*

         */
         bcrypt.genSalt(10,(err, salt)=>{
            if(err) throw err; 
            bcrypt.hash(newUser.password,salt,(err,hash)=>{
               if(err) throw err;
               // set password to hash
               newUser.password = hash ;

               // saving the user
               newUser.save()
               .then(user=>{
                   req.flash('success_msg','you are now registered and can login');// now this only takes care of creating a flash mesg, but to display it we tweak messages.ejs
                   res.redirect('/users/login');
                   // so if registeration is successfull we want it ito redirect us back to the ligin page.
                   // now we want to flash a message to tell that we can login coz we've registered, and since we want it after the redirect, so thats why we need a flash msg
                   // coz what flash does is it stores it in a session and displays it after the redirect. redirecting is a diff story than rendering a view there we connect implement flash.
               })
               .catch(user => console.log(user));
           })
        });

       }
    });
}

});

// Login handle
router.post('/users/login',(req,res,next)=>{
passport.authenticate('local',{
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
})(req,res,next);// ye just jo kiya in (req,res,next) ye zaroori hai, as we saw in documenttion, so darrna mat LOL.
} );

router.get('/logout',(req,res)=>{
   req.logout(); 
   req.flash('success_msg','You are logged out');
   res.redirect('/users/login');
});

module.exports= router;
 