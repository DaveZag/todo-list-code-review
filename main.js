const taskInput = document.querySelector(".todo-input");
const errorMsg = document.querySelector(".error-cont");
const todoList = document.querySelector(".todo-list");
const todos = document.getElementsByClassName("todo");
const editable = document.getElementsByClassName("todo-editable");
const checkboxes = document.getElementsByClassName("check");
const clearBtn = document.querySelector(".clear-all");
const delAllBtn = document.querySelector(".delete-all");

// create an object template
class Task {
  constructor(description) {
    this.desc = description;
    this.id = 0;
    this.completed = false;
  }
}

// Add A Task to the DOM and Local Storage

function add() {
  let taskId = counter;

  taskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      if (taskInput.value !== "") {
        const newTask = new Task(taskInput.value.trim());
        newTask.id = taskId;
        displayOnAdd(newTask);
        saveToLocal(newTask);
        taskInput.value = "";
        taskId += 1;
      } else {
        errorMsg.classList.add("show");
      }
      editTask();
    }
  });

  taskInput.addEventListener("input", () => {
    errorMsg.classList.remove("show");
  });
}

// check the storage if empty or not

function checkStorage() {
  let tasks;
  let counter;
  const tested = [];
  if (localStorage.getItem("tasks") === null || localStorage.getItem("tasks") === "[]") {
    tasks = [];
    counter = tasks.length + 1;
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    counter = tasks[tasks.length - 1].id + 1;
  }

  tested.push(tasks);
  tested.push(counter);
  return tested;
}
const tasks = checkStorage[0];
const counter = checkStorage[1];

// Create markup for a task and display it in DOM

function displayTask(task) {
  const todo = document.createElement("li");
  todo.classList.add("todo", "flex", "flex-jc-sb", "limit");
  todo.setAttribute("tabindex", "0");
  todoList.appendChild(todo);
  const block1 = document.createElement("div");
  block1.classList.add("todo-block1");
  todo.appendChild(block1);
  const todoText = document.createElement("div");
  todoText.classList.add("flex", "flex-center", "text");
  if (task.completed === true) {
    todoText.innerHTML = `
    <input class="check" type="checkbox" name="todo" checked/>
       <span class="todo-editable" contenteditable="true"
     >${task.desc}</span>
  `;
  } else {
    todoText.innerHTML = `
      <input class="check" type="checkbox" name="todo"/>
         <span class="todo-editable" contenteditable="true"
       >${task.desc}</span>
    `;
  }
  block1.appendChild(todoText);
  const block2 = document.createElement("div");
  block2.classList.add("todo-block2", "flex", "flex-center");
  block2.innerHTML = `
          <button class="flex flex-center button"><i class="fa-solid fa-ellipsis-vertical todo-move"></i></button>
          <button class="flex flex-center button"><i class="fa-solid fa-trash-can todo-delete"></i></button>
        `;
  todo.appendChild(block2);
}

// Save to localStorage

function saveToLocal(value) {
  let tasks;
  if (localStorage.getItem("tasks") === null || localStorage.getItem("tasks") === "[]") {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }

  tasks.push(value);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// display task on add

function displayOnAdd(task) {
  displayTask(task);
}

// display task on page load

function displayOnAdd() {
  document.addEventListener("DOMContentLoaded", () => {
    tasks.forEach((task) => {
      displayTask(task);
    });
  });
}

// Edit task and store changes to local storage

function editTask() {
  let tasks;

  todoList.addEventListener("click", (e) => {
    if (
      localStorage.getItem("tasks") !== null ||
      localStorage.getItem("tasks") !== "[]"
    ) {
      tasks = JSON.parse(localStorage.getItem("tasks"));
    }

    const itemToEdit = e.target;
    const textContent = e.target.innerText;
    let editedText;
    if (e.target.classList.contains("todo-editable")) {
      itemToEdit.addEventListener("input", () => {
        editedText = itemToEdit.innerText;

        const editedArray = tasks.map((task) => {
          if (task.desc === textContent) {
            //  return modified object property
            return { ...task, desc: `${editedText}` };
          }
          return task;
        });

        localStorage.setItem("tasks", JSON.stringify(editedArray));
      });
    }
  });
}

// Check if Checkbox state, if checked or not.

function checkState() {
  let tasks;
  todoList.addEventListener("click", (e) => {
    if (
      localStorage.getItem("tasks") !== null &&
      localStorage.getItem("tasks") !== "[]"
    ) {
      tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    if (e.target.nodeName === "INPUT") {
      const element = e.target;
      const item = element.parentElement.innerText;

      if (element.checked) {
        element.parentElement.classList.add("completed");

        const editedArr = tasks.map((task) => {
          if (task.desc === item) {
            //  return modified object property
            return { ...task, completed: element.checked };
          }
          return task;
        });
        localStorage.setItem("tasks", JSON.stringify(editedArr));
      } else {
        element.parentElement.classList.remove("completed");

        const editedArr = tasks.map((task) => {
          if (task.desc === item) {
            //  return modified object property
            return { ...task, completed: false };
          }
          return task;
        });
        localStorage.setItem("tasks", JSON.stringify(editedArr));
      }
    }
  });
}

// check if checkbox is checked on load then style the checked task
function checkOnLoad() {
  const arrChecks = [...checkboxes];
  arrChecks.forEach((check) => {
    if (check.hasAttribute("checked")) {
      check.parentElement.classList.add("completed");
    }
  });
}

//  Delete task from LocalStorage

function deleteInStorage(element) {
  let tasks;
  if (localStorage.getItem("tasks") !== null && localStorage.getItem("tasks") !== "[]") {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }
  const itemToDelete = element.children[0].children[0].children[1].innerText;
  const index = tasks.map((task) => task.desc).indexOf(itemToDelete);
  tasks.splice(index, 1);
  let count = 1;
  tasks.forEach((element) => {
    element.id = count;
    count += 1;
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Delete from the DOM

function deleteFromDom() {
  todoList.addEventListener("click", (e) => {
    const item = e.target;
    const parent = item.parentElement.parentElement;
    // remove element from Dom when button is clicked
    if (
      item.nodeName === "BUTTON" &&
      item.children[0].classList.contains("todo-delete")
    ) {
      item.parentElement.parentElement.remove();

      // call delete in storage function
      deleteInStorage(parent);
      return;
    }

    // display or hide delete button on todo focus/blur
    if (item.nodeName === "LI") {
      const delBtn = item.children[1].children[1].children[0];
      const moveBtn = item.children[1].children[0].children[0];
      const todos = todoList.querySelectorAll(".todo");

      todos.forEach((todo) => {
        if (item === todo) {
          delBtn.classList.add("show");
          moveBtn.classList.add("hide");
        } else {
          todo.children[1].children[0].children[0].classList.remove("hide");
          todo.children[1].children[1].children[0].classList.remove("show");
        }
      });
    }
  });
}

// Delete all completed Tasks

function clearCompleted() {
  clearBtn.addEventListener("click", () => {
    // delete from DOM
    const checkboxes = [...document.getElementsByClassName("check")];
    checkboxes.forEach((check) => {
      if (check.checked === true) {
        check.parentElement.parentElement.parentElement.remove();
      }
    });

    // delete from localStorage
    let tasks;
    if (
      localStorage.getItem("tasks") !== null &&
      localStorage.getItem("tasks") !== "[]"
    ) {
      tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    // const arrClear = [...checkboxes];
    const arrUnchecked = tasks.filter((element) => element.completed !== true);
    localStorage.setItem("tasks", JSON.stringify(arrUnchecked));
  });
}

// Delete all tasks when refresh button is clicked

function clearAllTasks() {
  delAllBtn.addEventListener("click", () => {
    if (
      localStorage.getItem("tasks") !== null &&
      localStorage.getItem("tasks") !== "[]"
    ) {
      delAllBtn.classList.add("rotateIcon");
    } else {
      delAllBtn.classList.remove("rotateIcon");
    }
    localStorage.clear();
    const arrTodo = [...todos];
    setTimeout(() => {
      arrTodo.forEach((element) => {
        element.remove();
      });
    }, 400);
  });
}

// Call functions when Document is loaded !This code is from the index.js file!
document.addEventListener("DOMContentLoaded", () => {
  editTask();
  deleteFromDom();
  checkState();
  checkOnLoad();
  clearCompleted();
});
