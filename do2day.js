var app = {}; // create namespace for our app

app.Todo = Backbone.Model.extend({
  defaults: {
    title: '',
    hours: '',
    completed: false
  }
});

app.TodoList = Backbone.Collection.extend({
      model: app.Todo,
      localStorage: new Store("backbone-todo")
    });

    // instance of the Collection
    app.todoList = new app.TodoList();


// var AppView = Backbone.View.extend({
//       // el - stands for element. Every view has a element associate in with HTML 
//       //      content will be rendered.
//       el: '#container',
//       // It's the first function called when this view it's instantiated.
//       initialize: function(){
//         this.render();
//       },
//       // $el - it's a cached jQuery object (el), in which you can use jQuery functions 
//       //       to push content. Like the Hello World in this case.
//       render: function(){
//         this.$el.html("Hello World");
//       }
// });


app.TodoView = Backbone.View.extend({
      tagName: 'li',
      template: _.template($('#item-template').html()),
      render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this; // enable chained calls
      }
});


app.AppView = Backbone.View.extend({
      el: '#expected',
      initialize: function () {
        this.input = this.$('#new-todo');
        // when new elements are added to the collection render then with addOne
        app.todoList.on('add', this.addOne, this);
        app.todoList.on('reset', this.addAll, this);
        app.todoList.fetch(); // Loads list from local storage
      },
      events: {
        'keypress #new-todo': 'createTodoOnEnter'
      },
      createTodoOnEnter: function(e){
        if ( e.which !== 13 || !this.input.val().trim() ) { // ENTER_KEY = 13
          return;
        }
        app.todoList.create(this.newAttributes());
        this.input.val(''); // clean input box
      },
      addOne: function(todo){
        var view = new app.TodoView({model: todo});
        $('#todo-list').append(view.render().el);
      },
      addAll: function(){
        this.$('#todo-list').html(''); // clean the todo list
        app.todoList.each(this.addOne, this);
      },
      newAttributes: function(){
        return {
          title: this.input.val().trim(),
          completed: false
        }
      }
});


// app.AppView = Backbone.View.extend({
//       el: '#real',
//       initialize: function () {
//         this.input = this.$('#new-todo');
//         // when new elements are added to the collection render then with addOne
//         app.todoList.on('add', this.addOne, this);
//         app.todoList.on('reset', this.addAll, this);
//         app.todoList.fetch(); // Loads list from local storage
//       },
//       events: {
//         'keypress #new-todo': 'createTodoOnEnter'
//       },
//       createTodoOnEnter: function(e){
//         if ( e.which !== 13 || !this.input.val().trim() ) { // ENTER_KEY = 13
//           return;
//         }
//         app.todoList.create(this.newAttributes());
//         this.input.val(''); // clean input box
//       },
//       addOne: function(todo){
//         var view = new app.TodoView({model: todo});
//         $('#todo-list').append(view.render().el);
//       },
//       addAll: function(){
//         this.$('#todo-list').html(''); // clean the todo list
//         app.todoList.each(this.addOne, this);
//       },
//       newAttributes: function(){
//         return {
//           title: this.input.val().trim(),
//           completed: false
//         }
//       }
// });


app.TodoView = Backbone.View.extend({
      tagName: 'li',
      template: _.template($('#item-template').html()),
      render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        this.input = this.$('.edit');
        return this; // enable chained calls
      },
      initialize: function(){
        this.model.on('change', this.render, this);
        this.model.on('destroy', this.remove, this);
      },
      events: {
        'dblclick label' : 'edit',
        'keypress .edit' : 'updateOnEnter',
        'blur .edit' : 'close',
       'click .destroy': 'destroy'
      },
      edit: function(){
        this.$el.addClass('editing');
        this.input.focus();
      },
      close: function(){
        var value = this.input.val().trim();
        if(value) {
          this.model.save({title: value});
        }
        this.$el.removeClass('editing');
      },
      updateOnEnter: function(e){
        if(e.which == 13){
          this.close();
        }
      },

      destroy: function(){
        this.model.destroy();
      }
});


app.Router = Backbone.Router.extend({
      routes: {
        '*filter' : 'setFilter'
      },
      setFilter: function(params) {
        app.todoList.trigger('reset');
      }
});

app.router = new app.Router();
Backbone.history.start(); 
app.appView = new app.AppView();