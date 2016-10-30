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

		
	  title.textContent = this.map[this.index];

		const list = document.createElement('ul');
		for (let el = 0; el < this.list.length; el ++) {
			let first = false;
		  let last = false;

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
			console.log(new Task(el));
			this.list.push(new Task(el));
		});


		this.map = {
			'todo': 0,
			'inprogress': 1,
			'done': 2,
		};

		this.node.addEventListener('removeTask', (e) => {
	   console.log(e.detail);
	   const index = this.list.indexOf(e.detail);
	   this.list.splice(index, 1);
	   this.render();
	  });

	  this.node.addEventListener('moveUp', (e) => {
	  	const index = this.list.indexOf(e.detail);
	    e.detail.order -= 2;
	    this.render();
	  });

	  this.node.addEventListener('moveDown', (e) => {
	  	const index = this.list.indexOf(e.detail);
	    e.detail.order += 2;
	    this.render();
	  });

	  this.node.addEventListener('moveLeft', (e) => {
	  	const index = this.list.indexOf(e.detail);
	  	if (e.detail.status === 'done') {
	  		e.detail.status = 'inprogress';

	  	} else if (e.detail.status === 'inprogress'){
	  		e.detail.status = 'todo';
	  	}

	  	e.detail.order =  this.getNewOrder(e.detail);
	    this.render();	
	  });



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
	  });

	  this.node.addEventListener('addEvent', (e) => {
	  	this.list.push(new Task(e.detail));
	  	this.render();
	  })

	  this.render();
	}

	render() {
		this.columns = [[], [], []];
		this.node.innerHTML = '';

		this.list.forEach((el) => {
			console.log(el);
			this.columns[this.map[el.status]].push(el);
		})

		const taskKeys = Object.keys(this.columns);
		taskKeys.forEach((column, idx) => {

			const taskList = new Column(this.columns[column], idx)
			taskList.render()
			this.node.appendChild(taskList.render());

		})
		this.node.appendChild(this.addForm());
	}

	getNewOrder(el) {
		const columnLength = this.columns[this.map[el.status]].length;
  	let lastElOrder;
  	if (columnLength > 0) {
  		this.columns[this.map[el.status]].sort((a, b) => {
  			return a.order - b.order;
  		})
  		lastElOrder = this.columns[this.map[el.status]][columnLength - 1].order;
  		lastElOrder += 1;
  	} else {
  		lastElOrder = 0;
  	}
  	return lastElOrder;
	}
	createInput(type, name, required, inputClass, placeholder) {
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.placeholder = placeholder;

    input.required = required;
    return input;
  }
  addForm() {
    const status = {
      'todo': 'To Do',
      'inprogress': 'In Progress',
      'done': 'Done',
    };

    const wrap = document.createElement('div');
    wrap.classList.add('input');
    const title = this.createInput('text', 'task-name', true, 'text-input', 'Task name');
    title.classList.add('text-input');
    const submit = this.createInput('submit', 'task-submit', true, 'text-input');
    submit.classList.add('text-input');
    submit.value = 'Add to List!';

    const inner = document.createElement('div');
    inner.classList.add('input-flex');
    const fieldset1 = document.createElement('fieldset');
    const fieldset2 = document.createElement('fieldset');

    const label1 = document.createElement('label');
    const label2 = document.createElement('label');
    const numberInput = this.createInput('number', 'task-order', true, '', '0');
    numberInput.min = 0;
    numberInput.value = 0;

    label1.textContent = 'Status';
    label2.textContent = 'Order';

    const select = document.createElement('select');
    const statusKeys = Object.keys(status);
    const textarea = document.createElement('textarea');
    textarea.classList.add('text-input');
    textarea.name = 'task-desc';
    textarea.placeholder = 'Task description';

    statusKeys.forEach((el) => {
      const option = document.createElement('option');
      option.textContent = el;
      option.value = el;

      select.appendChild(option);
    });
    select.value = 'todo';
    let newTaskData = {};

  	const addEvent = new CustomEvent('addEvent', {
    	bubbles: true,
    	detail: newTaskData,
    })

  
    submit.addEventListener('click', function () {
    	newTaskData.name = title.value;
    	newTaskData.description = textarea.value;
    	newTaskData.order = parseInt(numberInput.value);
    	newTaskData.status = select.value;

    	console.log(newTaskData);
    	if (newTaskData.name) {
    		console.log(newTaskData);
    		this.dispatchEvent(addEvent);
    	}
    })

    fieldset1.appendChild(label1);
    fieldset1.appendChild(select);
    fieldset2.appendChild(label2);
    fieldset2.appendChild(numberInput);
    inner.appendChild(fieldset1);
    inner.appendChild(fieldset2);


    wrap.appendChild(title);
    wrap.appendChild(inner);
    wrap.appendChild(textarea);
    wrap.appendChild(submit);
    return wrap;
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




