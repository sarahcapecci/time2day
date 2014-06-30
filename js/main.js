$(document).ready(function(){

  $('a').on("click", function(e){
    e.preventDefault();
  });


  // CHART setting

  //STILL have to make it refresh everytime an item is added!

  var divLabel = $('div.view2').find("label");
  var activities = [];
  for (var i = 0; i < divLabel.length; ++i) {
    activities.push(divLabel[i].innerHTML);
  }

  var expectedTimes = $('div.view2').find(".expectedTime");
  var xpTimesArray = [];

  for (var i = 0; i < expectedTimes.length; ++i) {
    xpTimesArray.push(parseFloat(expectedTimes[i].innerHTML));
  }

  var realTimes = $('div.view2').find(".realTime");
  var realTimesArray = [];

  for (var i = 0; i < realTimes.length; ++i) {
    realTimesArray.push(parseFloat(realTimes[i].innerHTML));
  }



  var barChartData = {
        labels : activities,
        datasets : [
          {
            fillColor : "rgba(244, 163, 99, 0.5)",
            strokeColor : "rgba(244, 163, 99, 1)",
            data : xpTimesArray
          },
          {
            fillColor : "rgba(243, 108, 0, 0.5)",
            strokeColor : "rgba(243, 108, 0, 0.95)",
            data : realTimesArray
          },
        ]
  }



  // Chart Display

  $('.resultDisplay').on("click", function(e){
    e.preventDefault;
    $('#result').show(); 
    var timeChart = new Chart(document.getElementById("myChart").getContext("2d")).Bar(barChartData); 
  });


});



// RANGE OUTPUT
$(function() {
 var el, newPoint, newPlace, offset;
 
 // Select all range inputs, watch for change
 $("input[type='range']").change(function() {
 
   el = $(this);
   // Update value
   el
     .next("output")
     .text(el.val());
 })

  //page load
 .trigger('change');

});