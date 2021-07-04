const express = require('express');
const router = express.Router();
const {ensureAuthenticated}= require('../config/auth');// all we have to do is to pass it as a 2ndd param, and then it becomes protected


// Welcome page
router.get('/',(req,res)=>{
    res.render('welcome');
});

// Dashboard
router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    res.render('dashboard',
    {name: req.user.name}); // se we did user: req.user.name, to show our username on dasboard, but we did req.user.name, coz when we are logged in we have access to stuff like req.user,req.user.name,req.user.id etc.
});
module.exports = router;    