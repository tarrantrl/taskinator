var buttonEl = document.querySelector("#save-task");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var createTaskHandler = function() {
    var listItemEl = document.createElement("li");
    listItemEl.textContent="New task";
    listItemEl.className="task-item";
    tasksToDoEl.appendChild(listItemEl);
  }

  buttonEl.addEventListener("click", createTaskHandler);
