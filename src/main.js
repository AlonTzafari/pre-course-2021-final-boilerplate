"use strict"

let textInput;
let prioritySelector;
let addButton;
let sortButton;
let clearButton;
let counter;
let viewSection;
let todoList;

document.addEventListener("DOMContentLoaded", onLoad);
function onLoad() {
    //setup
    textInput = document.querySelector("#text-input");
    prioritySelector = document.querySelector("#priority-selector");
    addButton = document.querySelector("#add-button");
    sortButton = document.querySelector("#sort-button");
    clearButton = document.querySelector("#clear-button");
    counter = document.querySelector("#counter");
    viewSection = document.querySelector("#view-section");
    
    getPersistent(DB_NAME).then(data => {
        todoList = data;
        if (!todoList) todoList = [];
        renderList();
    });

    //UI elements events
    //add list entry
    addButton.onclick = () => {
        const todo = {
            checked: false,
            text: textInput.value,
            priority: prioritySelector.value,
            date: new Date().getTime()
        };
        todoList.push(todo);
        setPersistent(DB_NAME, todoList);
        renderList();
        textInput.value = "";
    };

    //sort
    sortButton.onclick = () => {
        todoList.sort( (a,b) => Number(b.priority) - Number(a.priority) );
        renderList();
    };

    //delete Button
    clearButton.onclick = event => {
        if ( !confirm("Are you sure?") ) return;
        const selectedElements = viewSection.querySelectorAll(".selected");
        if (selectedElements.length > 0) {
            event.preventDefault();
            for (const element of selectedElements) {
                removeElement(element);
            }
            counter.innerText = todoList.length;
        } else {
            todoList = [];
            renderList();
        }
        setPersistent(DB_NAME, todoList);
    }

    //selector event listener
    document.addEventListener("click",  event => {
        const item = event.target;
        const todoElements = viewSection.querySelectorAll(".todo-container");
        const isContainer = hasClass( item, "todo-container");
        const isContainerChild = hasClass(item.parentNode, "todo-container") && !hasClass(item, "todo-check") && !hasClass(item, "todo-edit");
        if (isContainer) {
            if(!event.ctrlKey) {
                for (const element of todoElements) {
                    element.classList.remove("selected");
                }
            } 
            item.classList.add("selected");
            event.preventDefault();
        } else if (isContainerChild) {
            if(!event.ctrlKey) {
                for (const element of todoElements) {
                    element.classList.remove("selected");
                }
            } 
            item.parentNode.classList.add("selected");
            event.preventDefault();
        } else {
            for (const element of todoElements) {
                element.classList.remove("selected");
            }
        }
    });

    //checkbox
    viewSection.addEventListener("change", event => {
        const checkbox = event.target;
        if ( !hasClass(checkbox, "todo-check") ) return;
        let checkboxs = viewSection.querySelectorAll(".todo-check");
        checkboxs = Array.from(checkboxs);
        const index = checkboxs.indexOf(checkbox);
        todoList[index].checked = checkbox.checked;
        setPersistent(DB_NAME, todoList);
        if (checkbox.checked) {
            checkbox.parentNode.classList.add("checked-task");
        } else {
            checkbox.parentNode.classList.remove("checked-task");
        }
    }); 
}

//helper functions

//clears view-section & inserts items from todoList
function renderList() {
    viewSection.innerHTML = "";
    counter.innerText = todoList.length;
    for(const todo of todoList) {
        const todoElement = createTodoElement(todo);
        viewSection.appendChild(todoElement);
    }
}

//builds an html element from todo object
function createTodoElement(todo) {
    const container = document.createElement("div");
    const todoCheck = document.createElement("input");
    const todoPriority = document.createElement("div");
    const timeStamp = document.createElement("div");
    const todoText = document.createElement("div");
    const todoEdit = document.createElement("div");
    container.classList.add("todo-container");
    todoCheck.classList.add("todo-check");
    todoPriority.classList.add("todo-priority");
    timeStamp.classList.add("todo-created-at");
    todoText.classList.add("todo-text");
    todoEdit.classList.add("todo-edit");
    todoCheck.setAttribute("Type", "checkbox");
    todoCheck.checked = todo.checked;
    if (todo.checked) container.classList.add("checked-task");
    todoPriority.innerText = todo.priority;
    timeStamp.innerText = dateToSQLFormat( new Date(todo.date) );
    todoText.innerText = todo.text;
    todoEdit.innerHTML = `<i class="fa fa-pencil" aria-hidden="true"></i>`; //awesome fonts
    todoEdit.onclick = createEditPrompt;
    container.append(todoCheck, todoPriority, timeStamp, todoText, todoEdit);
    return container;
}

//returns SQL datetime format from Date object
function dateToSQLFormat(date) {
    const year = date.getFullYear();
    const month = pad( date.getMonth() + 1 ); 
    const day = pad( date.getDate() );
    const hour = pad( date.getHours() );
    const minutes = pad( date.getMinutes() ); 
    const seconds = pad( date.getSeconds() ); 
    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
    
    //pads single digit value with 0
    function pad(num) {
        return (num + "").length < 2 ? "0" + num : num;
    }
}

function hasClass(element, className) {
    const classes = element.className.split(" ");
    return classes.indexOf(className) > -1;
}

//removes todo from html and todoList
function removeElement(element) {
    const index = todoElementIndex(element);
    element.remove();
    todoList.splice(index, 1);
}

//finds index of a todo-container element in the view section
function todoElementIndex(element) {
    const todoElements = Array.from( viewSection.querySelectorAll(".todo-container") );
    return todoElements.indexOf(element);
}

//edit button event handler.
function createEditPrompt(event) {
    const editButton = event.currentTarget;
    if ( !hasClass(editButton, "todo-edit") ) return;
    const todoText = editButton.parentNode.querySelector(".todo-text");
    //create prompt element:
    const editPromptContainer = document.createElement("div");
    const editPrompt = document.createElement("div");
    const editTextInput = document.createElement("input");
    const confirmEditButton = document.createElement("button");
    editPromptContainer.id = "edit-prompt-container";  
    editPrompt.id = "edit-prompt";
    editTextInput.classList.add("edit-input");
    confirmEditButton.classList.add("edit-confirm");
    editTextInput.value = todoText.innerText;
    confirmEditButton.innerText = "Edit";
    editPrompt.append(editTextInput, confirmEditButton);
    editPromptContainer.appendChild(editPrompt);
    document.body.appendChild(editPromptContainer);
    
    confirmEditButton.onclick = () => {
        todoText.innerText = editTextInput.value;
        const index = todoElementIndex(todoText.parentNode);
        todoList[index].text = todoText.innerText;
        setPersistent(DB_NAME, todoList);
        editPromptContainer.remove();
    };
}
