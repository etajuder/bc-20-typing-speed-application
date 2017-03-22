var express = require('express');
var bodyParser = require('body-parser');
var model = require('./model/model');
var admin = require("firebase-admin");
var firebase = require("firebase");
var bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var LocalStorage = require("node-localstorage").LocalStorage;
var data = new model();
var app = express();
var serviceAccount = require("./key.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://typing-speed-application-40a8b.firebaseio.com/"
});


var config = {
    apiKey: "AIzaSyAaGWeqOJrgbwFBOUHmw6PJEUwDkx_I7bk",
    authDomain: "typing-speed-application-40a8b.firebaseapp.com",
    databaseURL: "https://typing-speed-application-40a8b.firebaseio.com",
    storageBucket: "typing-speed-application-40a8b.appspot.com",
    messagingSenderId: "103445282826"
  };
  
  
  firebase.initializeApp(config);
  
var database = firebase.database();
//Templating Engine
var handlebars = require('express-handlebars');
        app.engine('.html',handlebars({extname: '.html',defaultLayout:'main'}));
        app.set('view engine','.html');
       
        //Set Static files
        app.use(express.static('assets'));
        
        //Set MiddleWares
        
        app.use(cookieParser());
        app.use(session({secret:"someshittysecret"}))
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended:true}))
        
        
      //Set Up Controllers
        
        app.get('/',hasAccess,function(req,res){
            data.layout = false;
            res.render("index",data);
        });
        
        app.get("/home",isLoggedIn,function(req,res){
           data.layout = false;
           res.render("home",data);
           
       });
       
        app.get("/logout",function(req,res){
           req.session.destroy(function(){console.log("logged out")});
           res.clearCookie('userId');
           res.redirect("/");
       });
       
       
       
       //Manage Request
       
       //Register Request
        app.post("/signup",function(req,res){
            var post = req.body;
            //Store values in 
            admin.auth().createUser({
                email: post.email,
                emailVerified: false,
                password: post.password,
                displayName: post.fullname,
                disabled: false
                   })
                    .then(function(userRecord) {
                             // See the UserRecord reference doc for the contents of userRecord.
                     res.cookie('fullname',post.fullname);
                     res.cookie('userId',userRecord.uid);
                     res.cookie('email',post.email);
                     
                     res.send({url:'/home',message:'Account successfully created',auth:true}); 
                    })
                    .catch(function(error) {
                     error.auth = false;
                     res.send(error);
                    });
            
            
        });
        
        
        //Login Request
        app.post("/login",function(req,res){
            var post = req.body;

                firebase.auth().signInWithEmailAndPassword(post.email, post.password).then(function(userRecord){

                          res.cookie('fullname',userRecord.displayName);
                          res.cookie('email',userRecord.email);
                          res.cookie('userId',userRecord.uid);
                           
                          res.send({url:'/home',message:'Logged in successfully',auth:true}); 
                      }).catch(function(error) {
                            
                            res.send(error);
                      });
       });

       
       //End Manage Request
      
      //End Controllers

    function isLoggedIn(req,res,next){
        if(req.cookies.userId === undefined){
            
            var error = new Error("User not Authenticated");
            res.redirect("/")
        }else{
            data.user.userId = req.cookies.userId;
            data.user.fullname = req.cookies.fullname;
            data.user.email = req.cookies.email;
            
            next();
        }
    }
    
    function hasAccess(req,res,next){
        if(req.cookies.userId === undefined){
            data.user.is_logged_in = false;
            data.user.not_logged_in = true;
        }else{
            data.user.is_logged_in = true;
            data.user.not_logged_in = false;
        }
        next();
    }

app.listen(3000);
