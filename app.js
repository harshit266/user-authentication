var express= require('express');
var mongoose = require('mongoose');
var User = require('./models/user');
var passport=require('passport');
const LocalStrategy = require('passport-local').Strategy;
const user=require('./models/user');
const router=express.Router();


var app= express();

//setting poassport
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

//setting up mongoose
mongoose.connect("mongodb://localhost/local");

app.set('view engine','ejs');
app.use('/static',express.static('public'));

//setting up body parser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/',function(req,res){
	res.render('index');
});

app.post("/addname", (req, res) => {
var myData = new User(req.body);
//console.log(myData.username);
//console.log(myData.password);
 myData.save()
 .then(item => {
 res.send("item saved to database");
 })
 .catch(err => {
 res.status(400).send("unable to save to database");
 });
});

//setting up passport 
passport.use(new LocalStrategy(
  function(username, password, done) {
      user.findOne({
        username: username
      }, function(err, user) {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false);
        }

        if (user.password != password) {
          return done(null, false);
        }
        return done(null, user);
      });
  }
));




app.post('/login',
  passport.authenticate('local', { successRedirect: '/loggedin',
                                   failureRedirect: '/signup',
                                   failureFlash: true })
);
app.get('/signup',function(req,res){
	res.render('signup');
});

app.listen(3000,function(){
	console.log("Port is listening to 3000");
});