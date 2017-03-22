
var model = function(){
	this.title = "Typing Speed";
	this.description = "Welcome to the best Typing Speed Application Checker";
	this.keywords = "typing master, typing Speed, speed typing, mavis beacon pro, mavis beacon hacks";
        this.user = {};
        
}



model.prototype.is_logged_in = function(req){
    return req.session.user === "";
}

module.exports = model;