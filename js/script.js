

var Board = Backbone.Collection.extend({
  model: Task,
});
var BoardView = Backbone.View.extend({
  tagName: "div",
  className: "board",
  template: _.template(''),
  render: function() {
    $(this.el).html(this.template());
    return this;
  }
});

var Task = Backbone.Model.extend({
  defaults: {
    name: "New Task Title",
    description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  }
});
var TaskView = Backbone.View.extend({
  tagName: 'li',
  // template: $('list-item').html(),
  render: function() {
    // var tmpl = _.template(this.template);
    // this.$el.html(tmpl(this.model.toJSON()));
    return this;
  }
});

var ColumnView = Backbone.View.extend({});

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
