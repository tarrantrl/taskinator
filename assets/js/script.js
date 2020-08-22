var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
// console.dir(formEl);

var createTaskHandler = function() {
    event.preventDefault();
    // console.log(event);
    // get form input
    var taskNameInput = document.querySelector("input[name='task-name'").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className="task-item";
    // create div
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML="<h3 class='task-name'>"+taskNameInput+"</h3><span class='task-type'>"+taskTypeInput+"</span>";
    // add info to list item
    listItemEl.appendChild(taskInfoEl);
    // add entire list item to list
    tasksToDoEl.appendChild(listItemEl);
  }

  formEl.addEventListener("submit", createTaskHandler);
