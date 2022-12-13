const taskInput = document.querySelector(".task-input input");
filters = document.querySelectorAll(".filters span");
clearAll = document.querySelector(".clear-btn");
taskBox = document.querySelector(".task-box");
const pendingTasks = document.querySelector("#task-left");

let editId;
let isEditedTask = false;

// assigning local storage
let todos = JSON.parse(localStorage.getItem("todo-list"));
filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    // console.log(btn);
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

function showTodo(filter) {
  let li = "";
  if (todos) {
    todos.forEach((todo, id) => {
      // if todo status is completed , set is completed value to chekced
      let isCompleted = todo.status == "completed" ? "checked" : "";
      if (filter == todo.status || filter == "all") {
        li += `<li class="task">
                 <label for="${id}">
                     <input onclick ="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                     <p class= "${isCompleted}">${todo.name}</p>
                 </label>
                 <div class="settings">
                 <i onclick = "showMenu(this)"  class="uil uil-ellipsis-h"></i>
                   
                     <ul class="task-menu">
                         <li onclick = "editTask(${id}, '${todo.name}')"> <i class="uil uil-pen"></i> Edit</li>
                         <li onclick = "deleteTask(${id})"> <i class="uil uil-trash"></i> Delete</li>
                     </ul>
                 </div>
            </li>`;
      }
    });
  }
  taskBox.innerHTML = li || `<span> You dont have any task here</span>`;
}
taskLeft();
showTodo("all");

function showMenu(selectedTask) {
  // getting task menu div
  let taskMenu = selectedTask.parentElement.lastElementChild;
  taskMenu.classList.add("show");
  document.addEventListener("click", (e) => {
    // removing show class from the task menu on document click
    if (e.target.tagName != "I" || e.target != selectedTask) {
      taskMenu.classList.remove("show");
    }
  });
}
function editTask(taskId, taskName) {
  editId = taskId;
  isEditedTask = true;
  taskInput.value = taskName;
  inputBox.focus();
  inputBox.classList.add("active");
}

function deleteTask(deleteId) {
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  taskLeft();
  showTodo("filter");
}

clearAll.addEventListener("click", () => {
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  taskLeft();
  showTodo("all");
});

function updateStatus(selectedTask) {
  // getting paragraph that contains task name
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    // updating the status of selected task to completed
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    // updating the status of selected task to pending
    todos[selectedTask.id].status = "pending";
  }
  taskLeft();
  localStorage.setItem("todo-list", JSON.stringify(todos));
}

//shows the task left
function taskLeft() {
  var counter = {};
  for (var i = 0; i < todos.length; i += 1) {
    //for countin status length
    counter[todos[i].status] = (counter[todos[i].status] || 0) + 1;
  }

  for (var key in counter) {
    if (counter[key] > 1) {
      console.log("we have ", key, "  status ", counter[key], " times");
    }
  }
  if (counter.pending == undefined) {
    pendingTasks.innerHTML = "0";
    return;
  }

  pendingTasks.innerHTML = counter.pending;
  console.log(counter);
}

document.getElementById("addBtn").addEventListener("click", () => {
  let userData = taskInput.value.trim();
  if (userData) {
    if (!isEditedTask) {
      //if isedited is not true
      if (!todos) {
        //if todo isn't exist then pass an empty array to todos list
        todos = [];
      }
      let taskData = { name: userData, status: "pending" }; //by default tsk status is pending
      console.log(taskData);

      todos.push(taskData); // adding a new data or task in todos storage
    } else {
      isEditedTask = false;
      todos[editId].name = userData;
    }
  }
  taskInput.value = "";

  localStorage.setItem("todo-data", JSON.stringify(todos)); //transforming js object into a json string & saving todo-data in todos
  taskLeft();
  showTodo(document.querySelector("span.active").id);
});

taskInput.addEventListener("keyup", (e) => {
  let userData = taskInput.value.trim();

  if (e.key == "Enter" && userData) {
    // console.log(userData)
    if (!isEditedTask) {
      //if isedited is not true
      if (!todos) {
        //if todo isn't exist then pass an empty array to todos list
        todos = [];
      }
      let taskData = { name: userData, status: "pending" }; //by default tsk status is pending
      console.log(taskData);

      todos.push(taskData); // adding a new data or task in todos storage
    } else {
      isEditedTask = false;
      todos[editId].name = userData;
    }

    taskInput.value = "";

    localStorage.setItem("todo-data", JSON.stringify(todos)); //transforming js object into a json string & saving todo-data in todos
    taskLeft();
    showTodo(document.querySelector("span.active").id);
  }
});
