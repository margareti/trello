
Backbone.$ = $;

var Task = Backbone.Model.extend({
  initialize(args) {
    //Backbone.Model.apply(this, arguments);
  }
})
class TodoView extends Backbone.View {

  initialize(obj) {
    
  }
  render() {
    this.$el.html('TEST');
  }
}
const test = [
  {
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
 //  {
 //   name: '5.1',
 //   description: 'Finish the assignment',
 //   order: 1,
 //   status: 'inprogress'
 // },
 //   {
 //   name: 'Irregular verbs App',
 //   description: 'Rewrite app in angular',
 //   order: 2,
 //   status: 'inprogress'
 // },
  {
    name: 'SublimeLinter',
    description: 'install SublimeLinter',
    order: 0,
    status: 'done',
  },
];
const board = new TodoView({
  el: document.querySelector('.board')
})
const testTask = new Task(test[0]);

console.log(testTask)