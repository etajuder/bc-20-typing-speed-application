var express = require('express');
var bodyParser = require('body-parser');
var model = require('./model/model');
var admin = require("firebase-admin");
var firebase = require("firebase");
var cookieParser = require('cookie-parser');
var session = require('express-session');
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
        app.set('port', (process.env.PORT || 5000));
        //Set Static files
        app.use(express.static('assets'));
        
        //Set MiddleWares
        
        app.use(cookieParser());
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
       app.get("/leader",isLoggedIn,function(req,res){
           var ref = database.ref("/players");
           
         ref.on("value", function(snapshot) {
              data.leader_boards =snapshot.val();
         }, function (error) {
               console.log("Error: " + error.code);
         });
           data.layout = false;
           res.render("leader",data);
             
       });
       
        app.get("/logout",function(req,res){
           
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
                     database.ref('players/'+userRecord.uid).set({WPM:0,ACC:0,NAME:post.fullname});
                     res.cookie('acc',"0");
                     res.cookie('wpm',"0");
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
               var data = {};
               var record;
                firebase.auth().signInWithEmailAndPassword(post.email, post.password).then(function(userRecord){

                          res.cookie('fullname',userRecord.displayName);
                          res.cookie('email',userRecord.email);
                          res.cookie('userId',userRecord.uid);
                        
                         res.send({url:'/home',message:'Logged in successfully',auth:true}); 
                      }).catch(function(error) {
                            
                            res.send(error); 
                      });
                    
                      
                   
       });

       app.post("/update_record",function(req,res){
           var post = req.body;
           var ACC = post.percent;
           var WPM = post.wpm;
           var user = database.ref("players/"+req.cookies.userId);
           user.update({
               "ACC":ACC,
               "WPM":WPM,
               "NAME":req.cookies.fullname
           });
           res.send("updated");
       });
       //End Manage Request
      
      //End Controllers

    function isLoggedIn(req,res,next){
        if(req.cookies.userId === undefined){
            
            var error = new Error("User not Authenticated");
            res.redirect("/")
        }else{
           
            var userId = req.cookies.userId;
             
             firebase.database().ref('players/' + userId).once('value').then(function(snapshot) {
                   var acc = snapshot.val().ACC;
                   var wpm = snapshot.val().WPM;
                   res.cookies('wpm','0');
                   res.cookies('acc','0');
                   set_values(wpm,acc);
            }).catch(function(error){
                console.log(eror);
            });
             data.user.userId = req.cookies.userId;
            data.user.fullname = req.cookies.fullname;
            data.user.email = req.cookies.email;
          data.user.word_per_minute = req.cookies.wpm;
          data.user.speed_percentage = req.cookies.acc;
          console.log(req.cookies)
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

app.listen(app.get('port'));
