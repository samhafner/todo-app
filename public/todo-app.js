
// This is the array that will hold the todo list items

let todoItems = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];

todoItems.forEach( todo => {
    renderTodo(todo);
})


// This function will create a new todo object based on the
// text that was entered in the text input, and push it into
// the "todoItems" array
function addTodo(text) {
    const todo = {
        text,
        checked: false,
        id: Date.now(),
    };

    todoItems.push(todo);
    localStorage.setItem('todos', JSON.stringify(todoItems)); 
    renderTodo(todo);
}


// Select the form and add a submit event listener
const form = document.getElementById('add-task');
form.addEventListener('submit', event => {
    // prevent page refresh on form submission
    event.preventDefault();
    // select the text input
    const input = document.getElementById('todo-input');
    // Get the value of the input and remove whitespace
    const text = input.value.trim();
    if (text !== '') {
        addTodo(text);
        // Reset the input field 
        input.value = '';
        input.focus();
    }
    if (text === '') {
        shake(document.getElementById('todo-input'), 6);
        document.getElementById('todo-input').focus();
    }
});

// Code that adds the todo items to the task container
function renderTodo(todo) {
    // Select the element with the "task-list" id
    const list = document.getElementById('task-list');

    // select the current todo item in the DOM
    const item = document.querySelector(`[data-key='${todo.id}']`);

    if (todo.deleted) {
        // remove the item from the DOM
        item.remove();
        return;
    }

    // Create a `div` element that holds the todo item and assign it to `node`
    const node = document.createElement("div");
    // Set the class attribute
    node.setAttribute('class', `flex hover:opacity-90`);

    // Depending on the status of todo.checked remove or add classes to display it properly
    if (todo.checked) {
        node.classList.add("opacity-40", "line-through", "dark:decoration-[#bec4d3]");
        node.classList.remove("hover:opacity-90");
    }
    if (!todo.checked) {
        node.classList.remove("opacity-40", "line-through", "dark:decoration-[#bec4d3]");
        node.classList.add("hover:opacity-90");
    }

    // Set the data-key attribute to the id of the todo to access it later
    node.setAttribute('data-key', todo.id);

    // Set the contents of the 'div' element created above
    node.innerHTML = `
        <button name="check-button" class="flex items-center bg-green-600 dark:bg-[#44ac7a] rounded-bl-3xl rounded-tl-3xl p-2">
            <i class="bi bi-check-circle-fill text-white hover:scale-150 dark:text-[rgba(4,25,85,255)] cursor-pointer"></i>
        </button>
        <div class="bg-sky-100 dark:bg-[#041955] p-2 w-full">
            <span class="dark:text-[#bec4d3]">${todo.text}</span>
        </div>
        <button name="delete-button" class="flex items-center justify-center bg-red-700 rounded-br-3xl rounded-tr-3xl p-2 w-11">
            <i class="bi bi-trash-fill hover:scale-150 dark:text-[rgba(4,25,85,255)] cursor-pointer"></i>
        </button>
    `;

    // If the item already exists in the DOM
    if (item) {
        // replace it
        list.replaceChild(node, item);
    } else {
        // otherwise append it to the end of the list
        list.append(node);
    }

    //select the new check and delete button by name and add an eventlistener to them
    const checkButton = node.querySelector("[name=check-button]")
    checkButton.addEventListener('click', function (event) {
        const itemKey = event.target.parentElement.parentElement.dataset.key;
        toggleDone(itemKey);
    })

    const deleteButton = node.querySelector("[name=delete-button]")
    deleteButton.addEventListener('click', function (event) {
        const itemKey = event.target.parentElement.parentElement.dataset.key;
        deleteTodo(itemKey);
    })

}

// Check and delete fuctionality
function deleteTodo(key) {
    // find the corresponding todo object in the todoItems array
    const index = todoItems.findIndex(item => item.id === Number(key));
    // Create a new object with properties of the current todo item
    // and a `deleted` property which is set to true
    const todo = {
        deleted: true,
        ...todoItems[index]
    };
    // remove the todo item from the array by filtering it out
    todoItems = todoItems.filter(item => item.id !== Number(key));
    renderTodo(todo);
    localStorage.setItem('todos', JSON.stringify(todoItems)); 
}

function toggleDone(key) {
    // findIndex is an array method that returns the position of an element
    // in the array.
    const index = todoItems.findIndex(item => item.id === Number(key));
    // Locate the todo item in the todoItems array and set its checked
    // property to the opposite. That means, `true` will become `false` and vice
    // versa.
    todoItems[index].checked = !todoItems[index].checked;
    renderTodo(todoItems[index]);
}