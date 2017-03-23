
var model = function(){
	this.title = "Typing Speed";
	this.description = "Welcome to the best Typing Speed Application Checker";
	this.keywords = "typing master, typing Speed, speed typing, mavis beacon pro, mavis beacon hacks";
        this.user = {};
        this.user.exercise = get_rand_word;
}



model.prototype.is_logged_in = function(req){
    return req.session.user === "";
}


function get_rand_word(){
    var words = ["Arsenal are facing the prospect of being without first choice goalkeeper Petr Cech for up to a month with a calf injury, reports The Daily Mail During her appearance, the head of service disclosed that the additional one year extension was conveyed to her office in a letter by the Chief of Staff to the President, Abba Kyari",
                   "Dr. Shuara had retired from the civil service as permanent secretary in the ministry of education in 2016, having attained the mandatory age limit and year of service before an extension was granted her to remain in service",
                   "Bellerin stated towards the end of last year that he had no interest in rejoining Barca but, despite repeating that he felt underappreciated at the club, he has conceded that the latest rumours are flattering Of his frustrations at Barca prior to joining Arsenal in 2011 he added",
                   "Arsenal manager Arsene Wenger said last week that it was difficult to imagine Bellerin signing for Barca so soon after renewing his contract at Emirates Stadium Bellerin has emerged as a main target for Barca before next season in some reports in Spain, with the right-back proving to be a particularly troublesome position for head coach Luis Enrique this term",
                   "Sergi Roberto has regularly been deployed as a makeshift wing-back, while Javier Mascherano has also been used in the position since Aleix Vidal suffered a serious ankle injury in February The feeling in and around the club makes you want to be a champion, the air in here is that of a champion"
                  ];
     var number = Math.floor((Math.random() * 4) );
     return words[number];
}

module.exports = model;