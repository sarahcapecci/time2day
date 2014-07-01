$(document).ready(function(){

  $('a').on("click", function(e){
    e.preventDefault();
  });


// RANGE OUTPUT

window.setInterval(function(){
var el;
 
 // Select all range inputs, watch for change
 $("input[type='range']").change(function() {
 
    el = $(this);
   // Update value
    el
     .next("output")
     .text(el.val());
 })

  //page load

    .trigger("change");
  }, 500);


});
