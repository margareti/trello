class Column {
	constructor(arr) {
		this.list = [];
		for (let item in arr) {
			this.list.push(new Task(arr[item]));
		}

		this.node = this.render()

	}
	render() {
		const elements = document.createElement('ul');
		for (let el in this.list) {
			elements.appendChild(this.list[el].render());
		}

		return elements;
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

		this.columns = {};

		for (let el in status) {
			if (!this.columns[status]) {
				this.columns[status] = [];
			}
			
			this.columns[status].push(new Column(this[status[el]]));

			this.node.appendChild(this.columns[status][el].render());
		}

		this.node.addEventListener('removeTask', (e) => {
			console.log(e.detail);
			// const removeIdx = this.columns[e.detail.status]//.indexOf(e.detail);
			// console.log(this.columns[e.detail.status])
			// this.columns[e.detail.status].splice(removeIdx, 1);
			console.log(this.columns)
			//return this.render();
		})
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

		if (this.order !== 0) {
			top.textContent = '›';
			top.classList.add('control--top');
			top.classList.add('control');
			task.appendChild(top);
		}

		if (this.status !== 'todo') {
			left.textContent = '‹';
			left.classList.add('control--left');
			left.classList.add('control');
			task.appendChild(left);
		}

		if (this.status !== 'done') {
			right.textContent = '›';
			right.classList.add('control--right');
			right.classList.add('control');
			task.appendChild(right);
		}

		bottom.textContent = '›';
		bottom.classList.add('control--bottom');
		bottom.classList.add('control');
		task.appendChild(bottom);

		close.textContent = '✖';
		close.classList.add('close');

		title.textContent = this.name;
		desc.textContent = this.description;

		task.appendChild(close);
		task.appendChild(title);
		task.appendChild(desc);



		const event = new CustomEvent('removeTask', {
			bubbles: true,
			detail: this
		});

		close.addEventListener('click', function() {
			this.dispatchEvent(event);
		});


		return task;
	}
}

const test = [
 {
 	name: 'Red-Black Trees',
 	description: 'Решить задачу про черно-красные деревья',
 	order: 0,
 	status: 'todo'
 },
 {
 	name: 'AVL Trees',
 	description: 'Решить задачу про АВЛ деревья',
 	order: 1,
 	status: 'todo'
 },
 {
 	name: 'ESlint',
 	description: 'Figure out how to set $PATH variables on mac',
 	order: 0,
 	status: 'inprogress'
 },
 {
 	name: 'SublimeLinter བོད་ཡིག',
 	description: 'install SublimeLinter',
 	order: 0,
 	status: 'done'
 }
]

n = new Board(test, '.board');
console.log(n);




