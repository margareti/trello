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
  },
});

const ColumnView = Backbone.View.extend({
  tagName: 'div',
  template: _.template($('#list-column').html()),
  render: function(title) {
    const tmp = this.template({title: title})
    this.$el.html(tmp);
    return this;
  },
});

const Board = Backbone.Collection.extend({
  model: Task,
});

const BoardView = Backbone.View.extend({
  el: '.board',
  // template: _.template($('#list-item').html()),
  initialize: function() {
    this.render();
  },
  render: function() {
    this.$el.html('');
    const columns = [{
      title: 'To Do',
      id: 0,
    }, {
      title: 'In progress',
      id: 1,
    }, {
      title: 'Done',
      id: 2,
    }];

    columns.forEach(x => {
      const column = new ColumnView();
      this.$el.append(column.render(x.title).el);
      console.log(column.render(x.title).el);
    })
    
  },
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
// const board = new Board(test);
// const view = new BoardView();
// view.render();
// const task = new TaskView();
const view = new BoardView();