const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//passport config
require('./config/passport')(passport);// this is how we pass something in the module.exports of other file ka function
//DB config
const db = require('./config/keys').MongoURI;
//connect to mongo
mongoose.connect(db,{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{console.log('MongoDB Connected');})
.catch(err=> console.log(err));

const PORT = process.env.PORT || 5000;
/* In many environments (e.g. Heroku), and as a convention, you can set the environment variable PORT to tell your web server what port to listen on.
So process.env.PORT || 3000 means: whatever is in the environment variable PORT, or 3000 if there's nothing there.So you pass that to app.listen, or to app.set('port', ...), and that makes your server able to accept a "what port to listen on" parameter from the environment.
If you pass 3000 hard-coded to app.listen(), you're always listening on port 3000, which might be just for you, or not, depending on your requirements and the requirements of the environment in which you're running your server. */
const indexRoutes = require('./routes/index');
const usersRoutes = require('./routes/users');


//======EJS============
app.use(expressLayouts);// layout needs to be above registering view engine as EJS, or else layout won't work.
app.set('view engine','ejs');

//=======BodyParser===========
//we need to use bodyparser middleware coz we're taking data  from a form, so earlier bodyparser wass separate, but now it's been included in express itself.
// bodyparser basically gets the URL encoded data from form and turns it into an object , and thus when we look at doc in our database, it's in the form of  a  object.
app.use(express.urlencoded({extended : false}));// key: value in object. --> value can be only string or array when extended is false, but when true,it canbe anything
  
//========== Express Session middleware(uss flash message ke liye), coz flash needs session.==========
app.use(
    session({ 
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );// this is  just the correct middleware, and we don't know why we're using it.LOL.
  // passport local is a middleware that modifies the object created by express session.
  
//*************passport essential middleware************
app.use(passport.initialize());
app.use(passport.session());
// remember it only works if it's put after express-session middleware, coz passport requires session


//==========Connect flaash middleware======
  app.use(flash());

  //$$$$$$$ Global vars for colours of messages $$$$$$$$$$ 
  app.use((req,res,next)=>{// making a custom middleware to declare global variable.
  res.locals.success_msg = req.flash('success_msg');
  // this is the way to make a global variable or declare it.
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
  });


//========ROUTES=========
app.use(indexRoutes);
app.use(usersRoutes);




app.listen(PORT, console.log(`Server started on port ${PORT}`));





