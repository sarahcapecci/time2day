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
          hoursExpected: this.range.val()
          
        }
      }
});


// app.AppView2 = Backbone.View.extend({
//       el: '#real',
//       initialize: function () {
//         this.newRange = this.$('#real-time');
//         // when new elements are added to the collection render then with addOne
//         app.todoList.on('add', this.addOne, this);
//         app.todoList.on('reset', this.addAll, this);
//         app.todoList.fetch(); // Loads list from local storage
//       },
//       events: {
//         'click .saveTime': 'saveTime'
//       },
//       addOne: function(todo){
//         var view = new app.TodoView({model: todo});
//         $('#todo-list-copy').append(view.render().el);
//       },
//       addAll: function(){
//         this.$('#todo-list-copy').html('');
//          // clean the todo list
//         app.todoList.each(this.addOne, this);
//       },
//       saveTime: function(){
//         app.todoList.create(this.updateAttribute());
//         this.range.val('1'); // reset range to 1
//       },

//       updateAttribute: function(){
//         return {
//           hoursSpent: this.newRange.val();
//         }
//       }


// });



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
        'click .edit' : 'edit',
        'click .doneEditing' : 'updateValue',
       'click .destroy': 'destroy'
      },
      edit: function(){
        this.$el.addClass('nowEditing');
      },
      
      close: function(){
        var value = this.input.val().trim();
        if(value) {
          this.model.save({title: value});
        };
        var rangeValue = this.input.val();
        if(rangeValue) {
          this.model.save({hoursExpected: rangeValue});
        }

        this.$el.removeClass('nowEditing');
      },
      updateValue: function(){
          this.close(); 
      },
      destroy: function(){
        this.model.destroy();
      }
});

app.TodoView2 = Backbone.View.extend({
      tagName: 'li',

      template: _.template($('#item-template-2').html()),

      render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this; // enable chained calls
      },

      initialize: function(){
        this.model.on('change', this.render, this);
      },

      events: {
        'click .saveTime': 'updateValue'
      },

      close: function(){
        var rangeValueReal = this.$('#real-time').val();
        if(rangeValueReal) {
          this.model.save({hoursSpent: rangeValueReal});
        }
      },

      updateValue: function(){
          this.close(); 
      }
});


app.Router = Backbone.Router.extend({
      routes: {
        '*filter' : 'setFilter'
      },
      setFilter: function() {
        app.todoList.trigger('reset');
      }
});


    // instance of the Collection
    app.todoList = new app.TodoList();
app.router = new app.Router();
Backbone.history.start(); 
app.appView = new app.AppView();
// app.appView2 = new app.AppView2();