class Column {
	constructor(arr) {
		this.list = [];
		for (let item in arr) {
			this.list.push(new Task(arr[item]));
		}
	}
	render() {
		const list = document.createElement('ul');
		for (let el in this.list) {
			list.appendChild(this.list[el].render());
		}
		return list;
	}
}

class Board {
	constructor(arr, node) {
		const status = ['todo', 'inprogress', 'done'];
		for (let el in status) {
			this[status[el]] = [];
		}

		this.node = document.querySelector(node);

		for (let el in arr) {
			console.log(this[arr[el].status]);
			this[arr[el].status].push(arr[el]);
		}

		this.columns = [];

		for (let el in status) {
			this.columns.push(new Column(this[status[el]]));
			this.node.appendChild(this.columns[el].render());
		}
	}
}

class Task {
	constructor(obj) {
		this.name = obj.name;
		this.description = obj.description;
		this.order = obj.order;
		this.status = obj.status;
	}
	render() {
		const task = document.createElement('li');
		const title = document.createElement('h3');
		const desc = document.createElement('p');
		const close = document.createElement('span');
		const left = document.createElement('span');
		const right = document.createElement('span');
		const top = document.createElement('span');
		const bottom = document.createElement('span');

		right.textContent = '›';
		left.textContent = '‹';
		top.textContent = '›';
		bottom.textContent = '›';

		right.classList.add('control--right');
		left.classList.add('control--left');
		top.classList.add('control--top');
		bottom.classList.add('control--bottom');

		right.classList.add('control');
		left.classList.add('control');
		top.classList.add('control');
		bottom.classList.add('control');

		close.textContent = '✖';
		close.classList.add('close');

		title.textContent = this.name;
		desc.textContent = this.description;
		task.appendChild(close);
		task.appendChild(right);
		task.appendChild(left);
		task.appendChild(top);
		task.appendChild(bottom);
		task.appendChild(title);
		task.appendChild(desc);
		return task;
	}
}

const test = [
 {
 	name: 'Red-Black Trees',
 	description: 'Решить задачу про черно-красные деревья',
 	order: 1,
 	status: 'todo'
 },
 {
 	name: 'AVL Trees',
 	description: 'Решить задачу про АВЛ деревья',
 	order: 2,
 	status: 'todo'
 },
 {
 	name: 'ESlint',
 	description: 'Figure out how to set $PATH variables on mac',
 	order: 0,
 	status: 'inprogress'
 },
 {
 	name: 'SublimeLinter',
 	description: 'install SublimeLinter',
 	order: 1,
 	status: 'done'
 }
]

n = new Board(test, '.board');
console.log(n);


k = new Column(test);
console.log(k);

