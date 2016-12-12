const Task = Backbone.Model.extend({
  defaults: {
    name: 'New Task Title',
    description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
  },
});

const TaskView = Backbone.View.extend({
  tagName: 'li',
  template:$('#list-item').html(),
  render: function() {
    var tmpl = _.template(this.template);
    this.$el.html(tmpl(this.model.toJSON()));
    return this;
  }
});

const Board = Backbone.Collection.extend({
  model: Task,
});

const BoardView = Backbone.View.extend({
  tagName: 'div',
  className: 'board-inner',
  template: _.template('<p>TOTO</p>'),
  render: function() {
    $(this.el).html(this.template());
    return this;
  },
});



const ColumnView = Backbone.View.extend({
  tagName: 'div',
  template: $('list-column').html(),
  render: function() {
    var tmpl = _.template(this.template);
    this.$el.html(tmpl(this.model.toJSON()));
    return this;
  }
});

const test = [{
  name: 'Red-Black Trees',
  description: 'Решить задачу про черно-красные деревья',
  order: 0,
  status: 'todo' },
  {
    name: 'AVL Trees',
    description: 'Решить задачу про АВЛ деревья',
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
const board = new Board(test);
const view = new BoardView();
view.render();
const task = new TaskView();
