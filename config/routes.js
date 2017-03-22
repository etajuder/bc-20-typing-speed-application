var express = require('express');

var route = express.Router();

route.get("/home",function(req,res){
	res.send("Here will be the typing page");
});

route.get("/login",function(req,res){
	res.send("login page will be here");
});

route.get("/:id",function(req,res){
    res.send("Your id number is "+ req.params.id);
});

module.exports = route;