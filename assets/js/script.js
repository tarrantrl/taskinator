var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
// console.dir(formEl);

var taskFormHandler = function() {
    event.preventDefault();
    // console.log(event);
    // get form input
    var taskNameInput = document.querySelector("input[name='task-name'").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    //package form data as object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
    };
    // send it as an argument to createTaskEl
    createTaskEl(taskDataObj);
  }

  var createTaskEl = function(taskDataObj){
    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className="task-item";
    // create div
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML="<h3 class='task-name'>"+taskDataObj.name+"</h3><span class='task-type'>"+taskDataObj.type+"</span>";
    // add info to list item
    listItemEl.appendChild(taskInfoEl);
    // add entire list item to list
    tasksToDoEl.appendChild(listItemEl);
  }

  formEl.addEventListener("submit", taskFormHandler);
