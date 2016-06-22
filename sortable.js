const choo = require('choo')
const app = choo()

const STORAGE_ID = 'sortable-choo'
const save = (action, state, send) => {
  const data = {
    counter: state.counter,
    todos: state.todos
  }
  localStorage.setItem(STORAGE_ID, JSON.stringify(data))
}

const init = (send) => {
  setTimeout(() => {
    const json = localStorage.getItem(STORAGE_ID)
    if (json) {
      send('init', { payload: JSON.parse(json) })
    }
  }, 1)
}


let newView;    
function view (params, state, send) {
    newView = choo.view`
          <div id="main">
              <h1>${state.title}</h1>
              <ul id="sortedList">
                ${state.theList.map(function (item, index) {
	          return choo.view`<li
		    position="${index}" data-id="${item}"><i class="fa fa-bars reorder-handle"></i><input type="text" class="list-item" value="${item}"
		    onkeydown=${ e => e.keyCode == 13 && onEdit(event, index) || true}
		    onblur=${ e => onEdit(event, index) || true }
			/>
	          </li>`
 	        })}
              </ul>
              <form onsubmit=${onSubmit}>
              New: <input type="text" name="new_item" value="foo"
                    onkeydown=${e => e.keyCode === 13 && onEnter(event) || true}
                   >
                   <input type="submit" value="Submit">
	      </form>
          </div>
	  `
    
    console.log(newView);

    return newView;

    function onEdit (event, index) {
	console.log('onEdit hit');
	send('editItem', { data: { index: index, value: event.target.value } });
	event.target.blur();
	event.preventDefault();
    }
    function onEnter (event) {
	console.log('onEnter hit');
	send('addItem', { data: event.target.value });
	event.preventDefault();
    }
    function onSubmit(event) {
	console.log('onsubmit hit');
	send('addItem', { data: event.target.value });
	event.preventDefault();
    }
}

// http://stackoverflow.com/questions/872310/javascript-swap-array-elements

Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
	var k = new_index - this.length;
	while ((k--) + 1) {
	    this.push(undefined);
	}
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};

Array.prototype.replace = function (index, value) {
    this[index] = value;
    return this;
};

app.model({
    state: {
	title: 'Some title',
	theList: ['apple', 'banana', 'durian', 'mango' ]
    },
    subscriptions: [
	(send) => {
            setTimeout(() => {
		console.log('waiting');
                if (!newView) { return; }
		console.log('setting sortable up');
		Sortable.create(document.getElementById('sortedList'), {
		    animation:150,
		    handle: ".fa-bars",
		    draggable: 'li',
		    onEnd: function () {
			console.log('on end');
		    },
		    onUpdate: function(e) {
			console.log('on update');
			let newItems = ['a','b','c'];
			var oldPosition = e.item.getAttribute('position');
			var oldIndex    = e.item.getAttribute('data-id'); 
			var newPosition = this.toArray().indexOf(oldIndex);
			console.log("Moved " + oldPosition + " to " + newPosition);
			send('reorderItems', {data: { oldPosition: oldPosition, newPosition: newPosition }});
		    }
		});
            },1);
	},
    ],
    effects: {
	'reorderItems' :  (action, state) => console.log('effect:' , action.data)
    },
    reducers: {
	addItem: function(action,state) {
	    console.log('addItem: action=', action.data, ' state=', state);
	    return { title: action.data, theList: state.theList.concat(action.data) }
	},
	editItem: function(action,state) {
	    console.log('editItem: action=', action.data, ' state=', state);
	    return { title: action.data.value, theList: state.theList.slice().replace(action.data.index, action.data.value) }
	},
        reorderItems: function(action, state) {
	    console.log('got action data', action.data);
	    console.log('state.theList', state.theList);
	    var newList = state.theList.move(action.data.oldPosition, action.data.newPosition);
	    console.log('newList:', newList);
	    return { title: state.title, theList: newList};
        },
    },
});

console.log('sortable');

app.router((route) => [
    route('/', view)
]);

window.b_app = app;
const tree = app.start();
document.body.appendChild(tree);



