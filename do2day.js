var app = {}; // create namespace for our app

app.Todo = Backbone.Model.extend({
  defaults: {
    title: '',
    hours: ''
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



app.AppView = Backbone.View.extend({
      el: '#expected',
      initialize: function () {
        this.input = this.$("#new-todo");
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
      },
      addOne: function(todo){
        var view = new app.TodoView({model: todo});
        $('#todo-list').append(view.render().el);
        $('#todo-list-copy').append(view.render().el);
      },
      addAll: function(){
        this.$('#todo-list').html('');
         // clean the todo list
        app.todoList.each(this.addOne, this);
      },
      newAttributes: function(){
        return {
          title: this.input.val(),
          hours: this.$('input[type=range]').val(),
          completed: false
        }
      }
});


app.AppView2 = Backbone.View.extend({
      el: '#real',
      initialize: function () {
        // when new elements are added to the collection render then with addOne
        app.todoList.on('add', this.addOne, this);
        app.todoList.on('reset', this.addAll, this);
        app.todoList.fetch(); // Loads list from local storage
      },
      events: {
        'click .saveTime': 'saveTime'
      },
      saveTime: function(){

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
          hours: this.$('input[type=range]').val(),
          completed: false
        }
      }
});




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
        'click .edit' : 'edit',
        'click .doneEditing' : 'updateValue',
       'click .destroy': 'destroy'
      },
      edit: function(){
        this.$el.addClass('nowEditing');
      },
      close: function(){
        var value = this.$('input[type=text]').val().trim();
        if(value) {
          this.model.save({title: value});
        };
        var rangeValue = this.$('input[type=range]').val();
        if(rangeValue) {
          this.model.save({hours: rangeValue});
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
       
      },
      edit: function(){
        this.$el.addClass('nowEditing');
      },
      close: function(){

        var rangeValue = this.$('input[type=range]').val();
        if(rangeValue) {
          this.model.save({hours: rangeValue});
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
app.appView2 = new app.AppView2();