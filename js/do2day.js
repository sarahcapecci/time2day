var app = {};

app.Todo = Backbone.Model.extend({
  defaults: {
    title: '',
    hoursExpected: '',
    hoursSpent: ''
  }
});

app.TodoList = Backbone.Collection.extend({
      model: app.Todo,
      localStorage: new Store("tasks")
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
        this.$('.doneEditingTask').addClass('show');
        this.$('.editTask').addClass('hidden');
      },
      editTime: function(){
        this.$('#editRange').removeClass('hidden');
        this.$('.doneEditingTime').addClass('show');
        this.$('.editTime').addClass('hidden');
        this.$('.miniRangeOutput').removeClass('hidden');
      },
      updateTaskValue: function(){
        //sets what will be edited and updated
        var value = this.$('#editInput').val();
        if(value){
        this.model.save({title: value}); 
        }
        this.$('#editInput').removeClass('show');
        this.$('.doneEditingTask').removeClass('show');
        this.$('.editTask').removeClass('hidden');
        this.$('.editTime').removeClass('hidden');
        
      },
      updateTimeValue: function(){
        var rangeValue = this.$('#editRange').val();
        if(rangeValue) {
          this.model.save({hoursExpected: rangeValue});
        }
        this.$('#editRange').addClass('hidden');
        this.$('.doneEditingTime').removeClass('show');
      },

      updateValue: function(){
          this.updateTitle();
          this.updateHours(); 
          this.$el.removeClass('show');
      },
      destroy: function(){
        this.model.destroy();
      }
});

//View of the last part - when the day is over

app.TodoView2 = Backbone.View.extend({
      defaults: {
        hoursSpent: 0
      },

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
        'click .destroy': 'destroy',
        'click .editTask2': 'updateRealTime'
      },

      close: function(){
        var rangeValueReal = this.$('#real-time').val();
        if(rangeValueReal) {
          this.model.save({hoursSpent: rangeValueReal});
        }
         this.$('.saveTime').addClass('hidden');
         this.$('#real-time').addClass('hidden');
         this.$('.editTask2').removeClass('hidden');
         this.$('.miniRangeOutput').addClass('hidden');
         this.$('.realTime').removeClass('hidden');
      },

      updateValue: function(){
          this.close(); 
      },

      updateRealTime: function(){
        this.$('.saveTime').removeClass('hidden');
        this.$('#real-time').removeClass('hidden');
        this.$('.miniRangeOutput').removeClass('hidden');
        this.$('.editTask2').addClass('hidden');
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
      }
});

    // instance of the Collection
app.todoList = new app.TodoList();
app.router = new app.Router();
Backbone.history.start(); 
app.appView = new app.AppView();
