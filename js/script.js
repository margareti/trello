
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

  initialize: function(options) {
    this.idx = options.idx;
    this.ord = options.ord;
    this.last = options.last;
    this.maxRight = this.idx === Object.keys(columns).length - 1;
    this.render();
  },

  render: function(item) {
    const _this = this;
    this.$el.html(this.template({
      title: this.model.attributes.title, 
      name: this.model.attributes.name, 
      description: this.model.attributes.description, 
      id: this.idx,
      maxRight: this.maxRight,
      ord: this.ord,
      last: this.last,
    }));
    this.$el.draggable({
      stop: function() {
        const colWidth = $('ul').width();
        const offset = Math.round(parseInt(_this.$el.css('left'), 10) / colWidth);
        _this.model.trigger('drag', _this.model, offset);
      }
    });
    return this;
  },
  delete: function(){
    this.model.trigger('delete', this.model);
  },
  moveLeft: function() {
    this.model.trigger('moveLeft', this.model);
  },
  moveDown: function() {
    this.model.trigger('moveDown', this.model);
  },
  moveRight: function () {
    this.model.trigger('moveRight', this.model);
  },
  moveUp: function() {
    this.model.trigger('moveUp', this.model);
  },
});

const ColumnView = Backbone.View.extend({
  template: _.template($('#list-column').html()),
  initialize: function(options) {
    this.colIdx = options.idx;
    this.render();
  },
  render: function() {
    const column = this;
    let tmp = this.template(this.model);
    this.$el.html(tmp);
    this.$list = this.$('ul');
    this.model.tasks = this.model.tasks.sort(function sort(a, b) {
      return a.attributes.order - b.attributes.order;
    });

    this.model.tasks.forEach(function(el, index) {
      const task = new TaskView({
        model: el, 
        idx: column.colIdx, 
        ord: index, 
        last: index === column.model.tasks.length - 1
      });
      column.$list.append(task.render().el);
    });
    return this;
  },
});

const Board = Backbone.Collection.extend({
  model: Task,
  comparator: 'order',
  initialize: function() {
    this.on('delete', this.delete);
    this.on('moveDown', this.moveDown);
    this.on('moveLeft', this.moveLeft);
    this.on('moveUp', this.moveUp);
    this.on('moveRight', this.moveRight);
    this.on('addEvent', this.addEvent);
    this.on('drag', this.dragEvent);
  },
  setStatus: function(status, direction) {
    let current = columns[status].id;
    if (direction === 'right') {
      current++;
    } else if (direction === 'left') {
      current--;
    } else {
      current += direction;
    }
    return Object.keys(columns).filter(function(item) {
      return columns[item].id === current;
    })[0];
  },
  getLastOrder: function(colName) {
    const result = this.where({status: colName});
    return result.length;
  },
  addEvent: function() {
    const collection = this;
    const status = $('#newTaskStatus').val();
    const title = $('#newTaskTitle').val();
    const desc = $('#newTaskDesc').val();
    if (!desc || !title || !desc) return false;
    const newTask = {
      status: status,
      name: title,
      description: desc,
      order: collection.getLastOrder(status),
    };
    this.add(newTask);
  },
  delete: function(obj) {
    obj.destroy();
  },
  moveUp: function(obj) {
    obj.set({
      order: obj.get('order') - 2,
    });
  },
  moveDown: function(obj) {
    obj.set({
      order: obj.get('order') + 2,
    });
  },
  moveLeft: function(obj) {
    obj.set({
      status: this.setStatus(obj.get('status'), 'left'),
      order: this.getLastOrder(this.setStatus(obj.get('status'), 'left'))
    });
  },
  moveRight: function(obj) {
    obj.set({
      status: this.setStatus(obj.get('status'), 'right'),
      order: this.getLastOrder(this.setStatus(obj.get('status'), 'right'))
    });
  },
  dragEvent: function(obj, offset) {
    obj.set({
      status: this.setStatus(obj.get('status'), offset),
      order: this.getLastOrder(this.setStatus(obj.get('status'), offset))
    })
  }
});


const BoardView = Backbone.View.extend({
  el: '.board',
  initialize: function() {
    this.listenTo(board, 'all', this.render);
    this.render()
  },
  events: {
    'click .add': 'addEvent'
  },
  addEvent: function() {
    this.collection.trigger('addEvent');
  },
  template: _.template($('#input').html()),
  render: function() {
    const result = [];
    const columnKeys = Object.keys(columns);

    this.$el.html('');
    columnKeys.forEach(x => {
      columns[x].tasks = [];
    })

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
      let column = new ColumnView({model: item, idx: columns[x].id});
      this.$el.append(column.render().el);
    });
    this.$el.append(this.template);
  }
});

const tasks = [{
  name: 'Red-Black Trees',
  description: 'Do red-back trees assignment',
  order: 1,
  status: 'todo' },
  {
    name: 'AVL Trees',
    description: 'Also do the AVL Trees algorithm task',
    order: 0,
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
