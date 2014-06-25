$(function(){

var TodoToday = Backbone.Model.extend({
  defaults: {
    activity: "name your activity",
    time: "hours expected to be spent"
  }

});


var TodoTodayList = Backbone.Collection.extend({

  model: TodoToday


});



var TodoTodayView = Backbone.View.extend({

  tagName: 'li',
  template: _.template($('#item').html()),

  events: {
    'dblclick .edit': 'edit',
    'keypress .edit': 'update',
    'click a.destroy': 'clear'

  },

  initialize: function(){
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
  },

  render: function(){
    this.$el.html(this.template(this.model.activity));
    this.input = this.$('.edit');
    return this;
  },

  edit: function(){
    this.$el.addClass('edit');
    this.input.focus();
  },

  update: function(e) {
    if(e.keyCode == 13) {
      this.close();
    };
  },

  clear: function(){
    this.model.destroy();
  }



});


var AppView = Backbone.View.extend({
  el: $('#todotodayapp'),
  events: {
    "keypress #new-todo": 'createNew',
    "click #clear" : 'clearItem'
  },

  initialize: function() {
    this.input = this.$('#new-todo');

    this.listenTo(TodoToday, 'add', this.addOne);
    this.listenTo(TodoToday, 'reset', this.addAll);
    this.listenTo(TodoToday, 'all', this.render);

    TodoToday.fetch();
  },

  addOne: function(todo) {
       var view = new TodoTodayView({model: TodoToday});
       this.$("#todo").append(view.render().el);
  },

  addAll: function(){
    TodoToday.each(this.addOne, this);
  },

  createNew: function(e){
    if(e.keyCode != 13) return;
    if(!this.input.val()) return;

    TodoToday.create({activity: this.input.val()})
    this.input.val('');
  }


});

var App = new AppView;


});
