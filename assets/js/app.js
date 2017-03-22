
//main class
function App() {
    var _self   = this;
    
    this.oldPosition = 0;
    
    //views objects
    this.views  = {
        countdown:  $("#countdown"),
        clouds:     $("#clouds"),
        city:       $("#city"),
        city2:      $("#city2"),
        rocket:     $("#rocket"),
        wordpm:     $("#word_minute"),
        start:      $(".btn-start")
    };
    
    //init function
    this.init = function() {
        
       
                
        //animate background
        this.animate();      
    };
    
    this.animate = function() {
        //offset for clouds and cities
        var offset = 0;
        //offset for car
        var carOffset = parseInt(this.views.rocket.css('top'));
        
        //move clouds and cities
        window.setInterval(function(){
            _self.views.clouds.attr("style", "background-position: " + offset + "px 0px");
            _self.views.city.attr("style", "background-position: " + offset * 0.5 + "px 0px");
            _self.views.city2.attr("style", "background-position: " + offset * -1 + "px 0px");
            
            offset -= 1;
        }, 30);
       
        
        //first car animate
        var tmp = ($(document).height() - $(".center").height()) / 2;
        tmp += 400;
        _self.views.rocket.animate({
            top:  tmp  * -1
        }, 8000);
        
        //loop for car animate
        window.setInterval(function() {
            _self.views.rocket.removeAttr('style');
            _self.views.rocket.css('top', $(".center").height() + tmp);
            
            _self.views.rocket.animate({
                top:  tmp  * -1
            }, 4000);
        }, 8100);
        
    };
    var start = 8;
    
    var stop = 50;
    
    window.setInterval(function(){
        if(start < stop){
            _self.views.wordpm.html(""+start+"WPM");
        }
        start +=1;
    },5000);
    
    window.setTimeout(function(){
        _self.views.start.toggleClass('magictime twisterInUp');
    },3000);
    
  
}

$(document).ready(function(){
   //create and init app class
   window.app = new App();
   window.app.init();
});