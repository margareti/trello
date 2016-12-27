const app = {};


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

const Task = Backbone.Model.extend({
  defaults: {
    name: 'Sample Title',
    description: 'Sample description',
  },
  setStatus: function(status, direction) {
    var current = columns[status].id;
    if (direction === 'right') {
      current++;

    } else if (direction === 'left') {
      current--;
    }
    return Object.keys(columns).filter(function(item) {
      return columns[item].id === current;
    })[0];

  },
  moveRight: function() {
    this.set({
      status: this.setStatus(this.get('status'), 'right'),
    });
  },
  moveLeft: function() {
    this.set({
      status: this.setStatus(this.get('status'), 'left'),
    });
  },
  moveUp: function() {
    this.set({
      order: this.get('order') - 2,
    });
  },
  moveDown: function() {
    this.set({
      order: this.get('order') + 2,
    });
  },
  delete: function() {

  },

});

const TaskView = Backbone.View.extend({
  tagName: 'li',
  template:_.template($('#list-item').html()),
  events: {
    'click .close': 'delete',
    'click .control--left': 'moveLeft',
    'click .control--top': 'moveUp',
    'click .control--right': 'moveRight',
    'click .control--bottom': 'moveDown',
  },

  initialize: function(options) {
    this.model = options;
    this.render();
    this.listenTo(this.model, 'change', this.change);
  },
  render: function(item) {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },
  delete: function del() {
    this.model.delete();
  },
  moveLeft: function left() {
    this.model.moveLeft();
  },
  moveUp: function top() {
    this.model.moveUp();
  },
  moveRight: function right() {
    this.model.moveRight();
  },
  moveDown: function down() {
    this.model.moveDown();
  },
  change: function () {
    console.log("taskView registers model change")
  }
});
const ColumnModel = Backbone.Model.extend({});

const Column = Backbone.Collection.extend({
  model: ColumnModel,
});

const ColumnView = Backbone.View.extend({
  template: _.template($('#list-column').html()),
  initialize: function(options) {
    this.model = options;
    this.listenTo(this.model.tasks, 'change', this.change);
  },
  render: function() {
    const tmp = this.template({title: this.model.title});
    this.$el.html(tmp);
    this.$list = this.$('ul');

    this.model.tasks = this.model.tasks.sort(function sort(a, b) {
      return a.attributes.order - b.attributes.order;
    });
    this.model.tasks.forEach(x => {
      var task = new TaskView(x);
      this.$list.append(task.render().el);
    });
    return this;
  },
  change: function() {
    console.log("columnView registers change");
  }
});

const Board = Backbone.Collection.extend({
  model: Task,
  initialize: function() {
    // this.on( "change:status", this.statusChange, this);
    console.log("init Board ", this);

  },
  statusChange: function() {
    console.log("Board collection registers change");
  }
});


const BoardView = Backbone.View.extend({
  el: '.board',
  initialize: function(options) {
    this.model = options;
    this.render();
    this.listenTo(this.model, 'change', this.change);
    console.log("board model ", this.model)
  },
  
  render: function() {
    this.model.forEach(x => {
      if (!columns[x.status].tasks) {
        columns[x.status].tasks = [];
      }
      columns[x.status].tasks.push(new Task(x));
    });

    var columnKeys = Object.keys(columns);
    columnKeys.forEach(x => {
      var column = new ColumnView(columns[x]);
      this.$el.append(column.render().el);
    });
  },
  change: function() {
    console.log("board view change on model change")
  }
});

const tasks = [{
  name: 'Red-Black Trees',
  description: 'Do red-back trees assignment',
  order: 2,
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

var board = new Board(tasks);
var boardView = new BoardView(board);