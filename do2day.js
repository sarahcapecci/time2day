var app = {}; // create namespace for our app

app.Todo = Backbone.Model.extend({
  defaults: {
    title: '',
    hoursExpected: '',
    hoursSpent: ''
  }
});

app.TodoList = Backbone.Collection.extend({
      model: app.Todo,
      localStorage: new Store("backbone-todo")
});

app.AppView = Backbone.View.extend({
      el: '#expected',
      initialize: function () {
        this.input = this.$("#new-todo");
        this.range = this.$('#expected-time');
        this.newRange = this.$('#real-time');
        // when new elements are added to the collection render then with addOne
        app.todoList.on('add', this.addOne, this);
        app.todoList.on('reset', this.addAll, this);
        app.todoList.fetch(); // Loads list from local storage
      },
      events: {
        'click .saveTask': 'createTask'
      },
      createTask: function(){
        app.todoList.create(this.newAttributes());
        this.input.val(''); // clean input box
        this.range.val('1'); // reset range to 1
      },
      addOne: function(todo){
        var view = new app.TodoView({model: todo});
        var view2 = new app.TodoView2({model: todo});
        $('#todo-list').append(view.render().el);
        $('#todo-list-copy').append(view2.render().el);
      },
      addAll: function(){
        this.$('#todo-list').html('');
        this.$('#todo-list-copy').html('');
         // clean the  list
        app.todoList.each(this.addOne, this);
      },
      newAttributes: function(){
        return {
          title: this.input.val(),
          hoursExpected: this.range.val(),
          hoursSpent: this.newRange.val()   
        }
      }
});


app.TodoView = Backbone.View.extend({
      tagName: 'li',
      template: _.template($('#item-template').html()),
      render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        this.input = this.$('#new-todo');
        return this; // enable chained calls
      },
      initialize: function(){
        this.model.on('change', this.render, this);
        this.model.on('destroy', this.remove, this);

      },
      events: {
        'click .editTask' : 'editTask',
        'click .editTime' : 'editTime',
        'click .doneEditingTask' : 'updateTaskValue',
        'click .doneEditingTime' : 'updateTimeValue',
       'click .destroy': 'destroy'
      },
      editTask: function(){
        this.$('#editInput').addClass('show');
      },
      editTime: function(){
        this.$('#editRange').addClass('show');
      },
      updateTaskValue: function(){
        //sets what will be edited and updated
        var value = this.$('#editInput').val();
        if(value){
        this.model.save({title: value});  
        }
        this.$('#editInput').removeClass('show');
        
      },
      updateTimeValue: function(){
        var rangeValue = this.$('#editRange').val();
        if(rangeValue) {
          this.model.save({hoursExpected: rangeValue});
        }
        this.$('#editRange').removeClass('show');
      },

      updateValue: function(){
          this.updateTitle();
          this.updateHours(); 
          this.$el.removeClass('nowEditing');
      },
      destroy: function(){
        this.model.destroy();
      }
});

//View of the last part - when the day is over

app.TodoView2 = Backbone.View.extend({

      tagName: 'li',

      template: _.template($('#item-template-2').html()),

      render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this; // enable chained calls
      },

      initialize: function(){
        this.model.on('change', this.render, this);
        this.model.on('destroy', this.remove, this);
      },

      events: {
        'click .saveTime': 'updateValue',
        'click .destroy': 'destroy'
      },

      close: function(){
        var rangeValueReal = this.$('#real-time').val();
        if(rangeValueReal) {
          this.model.save({hoursSpent: rangeValueReal});
        }
      },

      updateValue: function(){
          this.close(); 
      },

      destroy: function(){
        this.model.destroy();
      }
});


//Router - 
app.Router = Backbone.Router.extend({
      routes: {
        'start' : 'startApp'
      },
      startApp: function() {
        app.todoList.trigger('reset');
        // app.todoList.reset();

      }
});


    // instance of the Collection
app.todoList = new app.TodoList();
app.router = new app.Router();
Backbone.history.start(); 
app.appView = new app.AppView();



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
          fillColor : "rgba(220,220,220,0.5)",
          strokeColor : "rgba(220,220,220,1)",
          data : xpTimesArray
        },
        {
          fillColor : "rgba(151,187,205,0.5)",
          strokeColor : "rgba(151,187,205,1)",
          data : realTimesArray
        }
      ]

    }

var myLine = new Chart(document.getElementById("myChart").getContext("2d")).Bar(barChartData);