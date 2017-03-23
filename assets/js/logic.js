



$(document).ready(function() {
    $('#exercise').bind('copy paste', function(e) {
        e.preventDefault();
    });
});


            var timestart = 0;
            var wrong_typed = 0;
            var total_word_typed = 0;
            var percentage_right = 0;
            $("body").on("click","#action",function(){
                
                var ready = $("#ready");
                var typed = $(".typed");
                var form_section = $(".form_section");
                var exercise = $("#exercise");
                var stage = $(this).text();
                
                if(stage === "Set!"){
                    ready.hide();
                    exercise.removeAttr("style");
                    $(this).text("Go!")
                }else if(stage === "Go!"){
                    $("#typing_area").val("");
                    typed.removeAttr("style");
                     timestart = +new Date();
                     wrong_typed = 0;
                     total_word_typed = 0;
                     percentage_right = 0;
                    form_section.removeAttr("style");
                    $(this).hide();
                }
            });
            
     
          
          
          $(document).ready(function(){
              
              
                var exercise = $("#exercise").text();
                
                var exercise_array = exercise.split(" ");
                var typing_area = $("#typing_area");
                var typed = $(".typed");
                var wpm = $("#wpm");
                
               typing_area.keydown(function(event){
                   
                   if(event.which === 32){
                        var word = typing_area.val();
                        var word_count = word.split(" ");
                     
                         move_typed(word);
                         total_word_typed = word_count.length; 
                     
                     
                      if(exercise_array.length === word_count.length){
                          
                            var timestop = +new Date();
                            var total_minute = Math.ceil(((timestop - timestart)/1000)/60);
                            typing_area.val("");
                            typing_area.hide();
                            $("#start_again").removeAttr("style");
                            var wpm =Math.ceil(word_count.length/total_minute);
                            $("#word_per_minute").html(wpm+" WPM");
                            send_report(wpm,percentage_right);
                       }
                      
                      
                   }
               });
               
               function move_typed(word){
                   var arr_w = word.split(" ");
                   var word_builder = "";
                   var index = 0;
                   arr_w.forEach(function(typed){
                      
                       if(typed === exercise_array[index]){
                           
                                word_builder+=" "+typed;
                                
                       }else{
                              if(typed === ""){
                                 word_builder+=" "+"<span class='error_word'>"+"-"+"</span>";   
                              }else{
                                word_builder+=" "+"<span class='error_word'>"+typed+"</span>";
                            }
                       }
                      
                       index+=1;
                       
                   });
                    update_score_board(word_builder,arr_w);
                    typed.html(word_builder);
               }
               
               function update_score_board(word,arr){
                   
                   var tot_tag_open = 0;
                   var findtags = word.split("");
                   
                  findtags.forEach(function(i){
                      if(i === "<"){
                          
                          tot_tag_open+=1;
                      }
                  });
                  total_word_typed = arr.length;
                  
                  wrong_typed = tot_tag_open/2;
                  
                  percentage_right = wrong_typed === 0? 100 : 100 - Math.ceil((wrong_typed/total_word_typed)*100);
                  
                  $("#wrongly_typed").html((wrong_typed)+" WWT");
                  $("#total_word_typed").html(arr.length+" TWT");
                  $("#percentage").html(percentage_right+"% ACC");
                   
               }  
               
               function send_report(wpm,percent){
                   $.ajax({
                       url: "/update_record",
                       type: 'POST',
                       data: {wpm:wpm,percent:percent},
                       success: function(data, textStatus, jqXHR) {
                 
                         }
                   });
               }
               
            });