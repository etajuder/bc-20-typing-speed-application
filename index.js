var express = require('express');
var app = express();
var router = express.Router();


app.use(function(req,res,next){
    console.log("not showing date",Date.now());
    next();
});



app.get("/home",function(req,res){
    res.send("Welcome");
});



app.listen(3000);