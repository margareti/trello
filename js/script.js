class Column {
	constructor(arr, idx) {
		this.list = [];
		for (let item in arr) {
			this.list.push(arr[item]);
		}

		console.log(this.list)
		this.list = this.list.sort(function(a, b) {
			return a.order - b.order;
		})
		this.index = idx;
		this.map = ['To do', 'In progress', 'Done'];
	}
	render() {
		const div = document.createElement('div');
		const title = document.createElement('h2');
		let first = false;
		let last = false;
		
	  title.textContent = this.map[this.index];

		const list = document.createElement('ul');
		for (let el = 0; el < this.list.length; el ++) {
			if (el === 0) {
				first = true;
			} 
			if (el === this.list.length - 1) {
				last = true;
			}
			list.appendChild(this.list[el].render(first, last));
		}
		div.appendChild(title);
		div.appendChild(list);
		return div;
	}
}

class Board {
	constructor(arr, node) {

		this.node = document.querySelector(node);

		
		this.list = [];
		arr.forEach((el) => {
			console.log(new Task(el))
			this.list.push(new Task(el))
		})


		this.map = {
			'todo': 0,
			'inprogress': 1,
			'done': 2
		}

		this.node.addEventListener('removeTask', (e) => {
	   console.log(e.detail);
	   const index = this.list.indexOf(e.detail);
	   this.list.splice(index, 1);
	   this.render();
	  })

	  this.node.addEventListener('moveUp', (e) => {
	  	const index = this.list.indexOf(e.detail);
	    e.detail.order -= 2;
	    this.render();
	  })

	  this.node.addEventListener('moveDown', (e) => {
	  	const index = this.list.indexOf(e.detail);
	    e.detail.order += 2;
	    this.render();
	  })

	  this.node.addEventListener('moveLeft', (e) => {
	  	const index = this.list.indexOf(e.detail);
	  	if (e.detail.status === 'done') {
	  		e.detail.status = 'inprogress';

	  	} else if (e.detail.status === 'inprogress'){
	  		e.detail.status = 'todo';
	  	}

	  	e.detail.order =  this.getNewOrder(e.detail);
	    this.render();	
	  })

	  this.node.addEventListener('moveRight', (e) => {
	  	const index = this.list.indexOf(e.detail);
	  	console.log(e.detail)
	  	if (e.detail.status === 'todo') {
	  		e.detail.status = 'inprogress';

	  	} else if (e.detail.status === 'inprogress'){
	  		e.detail.status = 'done';
	  	}
	  	
	  	e.detail.order = this.getNewOrder(e.detail);
	    this.render();	
	  })

	  this.render();
	}

	render() {
		this.columns = [[], [], []];
		this.node.innerHTML = '';
		
		this.list.forEach((el) => {
			this.columns[this.map[el.status]].push(el);
		})

		const taskKeys = Object.keys(this.columns);
		taskKeys.forEach((column, idx) => {

			const taskList = new Column(this.columns[column], idx)
			taskList.render()
			this.node.appendChild(taskList.render());

		})
	}

	getNewOrder(el) {
		const columnLength = this.columns[this.map[el.status]].length;
		console.log("column array ", this.columns[this.map[el.status]])
		console.log("column length is ", columnLength);
  	let lastElOrder;
  	if (columnLength > 0) {
  		this.columns[this.map[el.status]].sort((a, b) => {
  			return a.order - b.order;
  		})
  		lastElOrder = this.columns[this.map[el.status]][columnLength - 1].order;
  		console.log('lastElOrder before incrementing ', lastElOrder);
  		console.log("last element is ", this.columns[this.map[el.status]][columnLength - 1])
  		lastElOrder += 1;
  	} else {
  		lastElOrder = 0;
  	}
  	console.log('last el order is ', lastElOrder)
  	console.log('for ', el);
  	return lastElOrder;
	}
}

class Task {
	constructor(obj) {
		this.name = obj.name;
		this.description = obj.description;
		this.order = obj.order;
		this.status = obj.status;
	}
	render(first, last) {
		const task = document.createElement('li');
		const title = document.createElement('h3');
		const desc = document.createElement('p');
		const close = document.createElement('span');
		const left = document.createElement('span');
		const right = document.createElement('span');
		const top = document.createElement('span');
		const bottom = document.createElement('span');
		if (!first) {
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

		if (!last) {
			bottom.textContent = '›';
			bottom.classList.add('control--bottom');
			bottom.classList.add('control');
			task.appendChild(bottom);
		}


		close.textContent = '×';
		close.classList.add('close');

		title.textContent = this.name;
		desc.textContent = this.description;

		task.appendChild(close);
		task.appendChild(title);
		task.appendChild(desc);


		const remove = new CustomEvent('removeTask', {
	   bubbles: true,
	   detail: this
	  });
	  const moveUp = new CustomEvent('moveUp', {
	  	bubbles: true,
	  	detail: this
	  })
	  const moveDown = new CustomEvent('moveDown', {
	  	bubbles: true,
	  	detail: this
	  })
	  const moveRight = new CustomEvent('moveRight', {
	  	bubbles: true,
	  	detail: this
	  })

	  const moveLeft = new CustomEvent('moveLeft', {
	  	bubbles: true,
	  	detail: this
	  })

	  close.addEventListener('click', function() {
	   this.dispatchEvent(remove);
	  });

	  top.addEventListener('click', function() {
	  	this.dispatchEvent(moveUp);
	  })

	  right.addEventListener('click', function() {
	  	this.dispatchEvent(moveRight);
	  })

	  left.addEventListener('click', function() {
	  	this.dispatchEvent(moveLeft);
	  })

	  bottom.addEventListener('click', function() {
	  	this.dispatchEvent(moveDown);
	  })


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
 //  {
 // 	name: '5.1',
 // 	description: 'Finish the assignment',
 // 	order: 1,
 // 	status: 'inprogress'
 // },
 //   {
 // 	name: 'Irregular verbs App',
 // 	description: 'Rewrite app in angular',
 // 	order: 2,
 // 	status: 'inprogress'
 // },
 {
 	name: 'SublimeLinter',
 	description: 'install SublimeLinter',
 	order: 0,
 	status: 'done'
 }
]

n = new Board(test, '.board');
console.log(n);




