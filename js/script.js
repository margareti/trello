
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

const Task = Backbone.Model.extend();

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

  initialize: function() {
    this.listenTo(this.model, 'destroy', this.remove);
    this.render();
  },
  setStatus: function(status, direction) {
    let current = columns[status].id;
    if (direction === 'right') {
      current++;
    } else if (direction === 'left') {
      current--;
    }
    return Object.keys(columns).filter(function(item) {
      return columns[item].id === current;
    })[0];
  },

  render: function(item) {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },
  delete: function() {
    console.log("delete");
    this.model.destroy();
  },
  moveUp: function() {
    this.model.set({
      order: this.model.get('order') - 2,
    });
    console.log(this.model);
  },
  moveDown: function() {
    this.model.set({
      order: this.model.get('order') + 2,
    });
    console.log(this.model)
  },
  moveLeft: function() {
    this.model.set({
      status: this.setStatus(this.model.get('status'), 'left'),
    });
  },
  moveRight: function() {
    this.model.set({
      status: this.setStatus(this.model.get('status'), 'right'),
    });
  }
});

const ColumnView = Backbone.View.extend({
  template: _.template($('#list-column').html()),
  initialize: function() {
    console.log(this.model)
    this.render();
  },
  render: function() {

    let tmp = this.template(this.model);
    this.$el.html(tmp);
    this.$list = this.$('ul');

    this.model.tasks = this.model.tasks.sort(function sort(a, b) {
      return a.attributes.order - b.attributes.order;
    });

    this.model.tasks.forEach(x => {
      const task = new TaskView({model: x});
      this.$list.append(task.render().el);
    });
    return this;
  },
});

const Board = Backbone.Collection.extend({
  model: Task,
  comparator: 'order',
});


const BoardView = Backbone.View.extend({
  el: '.board',
  initialize: function(options) {
    this.listenTo(board, 'change', this.clear);
    this.render()
  },

  render: function() {
    const result = [];
    const columnKeys = Object.keys(columns);


    columnKeys.forEach(x => {
      columns[x].tasks = [];
    })

    //sort tasks
    this.collection.forEach(x => {
      if (!columns[x.attributes.status].tasks) {
        columns[x.attributes.status].tasks = [];
      }
      columns[x.attributes.status].tasks.push(x);
    });

    columnKeys.forEach(x => {
      let item = {
        title: x,
        tasks: columns[x].tasks,
      };
      result.push(item);
      let column = new ColumnView({model: item});
      this.$el.append(column.render().el);
    });
  },
  change: function() {
    console.log("board view change on model change");
    
  },
  clear: function() {
    this.$el.html('');

    this.render();
    console.log(this)
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


const board = new Board(tasks);
const boardView = new BoardView({collection: board});
