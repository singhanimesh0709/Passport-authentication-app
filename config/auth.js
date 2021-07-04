module.exports = {
    ensureAuthenticated: function(req,res,next){
     if(req.isAuthenticated()){
     // this req.isauthenticated() method was given to us by passport
     return next();
     }   
     req.flash('error_msg','Please login to view');
     res.redirect('/users/login');
    }
}

// so now this can act as a middleware (ensureAuthenticated), and we can  add this to any route that needs to be portected 
