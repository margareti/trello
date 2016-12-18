const app = {};
app.board = [];

const Task = Backbone.Model.extend({
  defaults: {
    name: 'Sample Title',
    description: 'Sample description',
  },
});

const TaskView = Backbone.View.extend({
  tagName: 'li',
  template:_.template($('#list-item').html()),
  initialize: function(options) {
    this.model = options;
    this.render();
  },
  render: function(item) {
    this.$el.html(this.template({name: this.model.name, description: this.model.description}));
    return this;
  },
});
const Column = Backbone.Collection.extend({
  model: Task,
});

const ColumnView = Backbone.View.extend({
  template: _.template($('#list-column').html()),
  initialize: function(options) {
    this.model = options;
    
  },
  render: function() {
    const tmp = this.template({title: this.model.title});
    this.$el.html(tmp);
    this.$list = this.$('ul');
    this.model.tasks.forEach(x => {
      console.log("list ", this.$list)
      var task = new TaskView(x);
      this.$list.append(task.render().el);
    });
    return this;
  },
});

const Board = Backbone.Collection.extend({
  model: Task,
});

const columns = {
  todo: {
    title: 'To Do',
    id: 0,
  },
  inprogress: {
    title: 'In Progress',
    id: 1,
  },
  done: {
    title: 'Done',
    id: 2,
  },
};

const BoardView = Backbone.View.extend({
  el: '.board',
  initialize: function(options) {
    this.model = options;
    this.render();
  },
  render: function() {
    this.model.forEach(x => {
      if (!columns[x.status].tasks) {
        columns[x.status].tasks = [];
      }
      columns[x.status].tasks.push(x);
    });

    var columnKeys = Object.keys(columns);
    columnKeys.forEach(x => {
      var column = new ColumnView(columns[x]);
      this.$el.append(column.render().el);
    });
  },
});

const tasks = [{
  name: 'Red-Black Trees',
  description: 'Do red-back trees assignment',
  order: 0,
  status: 'todo' },
  {
    name: 'AVL Trees',
    description: 'Also do the AVL Trees algorithm task',
    order: 1,
    status: 'todo',
  },
  {
    name: 'ESlint',
    description: 'Figure out how to set $PATH variables on mac',
    order: 0,
    status: 'inprogress',
  },
  {
    name: 'SublimeLinter',
    description: 'install SublimeLinter',
    order: 0,
    status: 'done',
  },
];

var board = new BoardView(tasks);
