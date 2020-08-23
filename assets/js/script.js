// counter to track IDs for added tasks
var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");

var tasks = [];

var taskFormHandler = function() {
    event.preventDefault();
    // console.log(event);
    // get form input
    var taskNameInput = document.querySelector("input[name='task-name'").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    // check if input values are empty
    if (!taskNameInput || !taskTypeInput){
        alert ("You need to fill out the task form!");
        return false;
    }
    formEl.reset();
    // check if data-task-id is in form to indicate editing status
    var isEdit = formEl.hasAttribute("data-task-id");
    // if editing
    if (isEdit) {
        // get task id from form
        var taskId = formEl.getAttribute("data-task-id");
        // pass to function to edit task
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    } 
    // if not editing
    else {
        //package form data as object
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do",
        };
        // send it as an argument to createTaskEl
    createTaskEl(taskDataObj);
    }   
}

var createTaskEl = function(taskDataObj){
    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className="task-item";
    //add task id as custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    // make list items draggable
    listItemEl.setAttribute("draggable", "true");
    // create div
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML="<h3 class='task-name'>"+taskDataObj.name+"</h3><span class='task-type'>"+taskDataObj.type+"</span>";
    // add info to list item
    listItemEl.appendChild(taskInfoEl);
    var taskActionsEl = createTaskActions(taskIdCounter);
    // append task actions to task list item
    listItemEl.appendChild(taskActionsEl);
    // add entire list item to list
    tasksToDoEl.appendChild(listItemEl);
    // add id to taskDataObj
    taskDataObj.id = taskIdCounter;
    // add task to task array
    tasks.push(taskDataObj);
    saveTasks();
    //increment counter
    taskIdCounter++;
}

var createTaskActions = function(taskId){
    // create a new div
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";
    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);
    // append button to div
    actionContainerEl.appendChild(editButtonEl);
    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);
    // append button to div
    actionContainerEl.appendChild(deleteButtonEl);
    // create drop down
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute ("data-task-id", taskId);
    // append option children to dropdown
    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++){
        // create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }
    // append dropdown to div
    actionContainerEl.appendChild(statusSelectEl);
    return actionContainerEl;
}

var taskButtonHandler = function(event){
    // get tart element
    var targetEl = event.target;
    // if edit button clicked
    if (targetEl.matches(".edit-btn")){
        var taskId = event.target.getAttribute("data-task-id");
        editTask(taskId);
    }
    // if delete button clicked
    else if (targetEl.matches(".delete-btn")){
        // get element's task id
        var taskId = event.target.getAttribute("data-task-id");
        //console.log(taskId);
        deleteTask(taskId);
    }
      
}

var deleteTask = function(taskId){
    var taskSelected = document.querySelector(".task-item[data-task-id='"+taskId+"']");
    taskSelected.remove();

    // create new array to hold updated list of tasks
    var updatedTaskArr = [];
    // loop through current tasks
    for (var i = 0; i < tasks.length; i++){
        // if id does not match, keep that and push to new array
        if (tasks[i].id !== parseInt(taskId)){
            updatedTaskArr.push(tasks[i]);
        }
    }
    // reassign tasks array to be updatedTaskArr
    tasks = updatedTaskArr;
    saveTasks();
}

var editTask = function(taskId){
    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='"+taskId+"']");
    // get content from name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    // put the name and type in the form
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    // update text on submit button to reflect editing status
    document.querySelector("#save-task").textContent="Save Task";
    formEl.setAttribute("data-task-id", taskId);
}

var completeEditTask = function(taskName, taskType, taskId){
    // find matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='"+taskId+"']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++){
        if (tasks[i].id == parseInt(taskId)){  
            // update task name and type in task array
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }

    saveTasks();

    //alert("Task Updated!");
    // revert task add form changes
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
}

var taskStatusChangeHandler = function(event){
    // event.target is the element that triggered the event
    // get task item id
    var taskId = event.target.getAttribute("data-task-id");
    // get currently selected options value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();
    // find parent task item
    var taskSelected = document.querySelector(".task-item[data-task-id='"+taskId+"']");
    // append task to proper section based on statusValue
    if (statusValue === "to do"){
        tasksToDoEl.appendChild(taskSelected);
    } else if (statusValue === "in progress"){
        tasksInProgressEl.appendChild(taskSelected);
    }else if (statusValue === "completed"){
        tasksCompletedEl.appendChild(taskSelected);
    }
    // update task's status task array
    for (var i = 0; i < tasks.length; i++){
        if (tasks[i].id = parseInt(taskId)){
            tasks[i].status = statusValue;
        }
    }
    saveTasks();
}

var dragTaskHandler = function(event){
    var taskId = event.target.getAttribute("data-task-id");
    // store data in the dataTransfer property of the event object itself
    event.dataTransfer.setData("text/plain", taskId);
}

var dropZoneDragHandler = function(event){
    // target of dragover is the element that is being dragged over, not the element being dragged
    // closest() searches up through ancestor elements of event.target, which is the drop zone
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl){
        event.preventDefault();
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");    
    }
}

var dropTaskHandler = function(event){
    // retrieve original dragged task from dataTransfer
    var id = event.dataTransfer.getData("text/plain");
    
    // reference the destination of drop as a DOM element
    var draggableElement = document.querySelector("[data-task-id='"+id+"']");
    
    // figure out where the item was dropped to get the task status
    // event.target in drop is the element that gets dropped on
    var dropZoneEl = event.target.closest(".task-list");
    var statusType = dropZoneEl.id;
    // update the task status
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");
    if (statusType === "tasks-to-do"){
        statusSelectEl.selectedIndex = 0;
    }
    else if (statusType === "tasks-in-progress"){
        statusSelectEl.selectedIndex = 1;
    }
    else if (statusType === "tasks-completed"){
        statusSelectEl.selectedIndex = 2;
    }
    // append the dragged task item to the destination drop zone
    dropZoneEl.appendChild(draggableElement);

    dropZoneEl.removeAttribute("style");
    // loop through tasks to find and update the updated task's status
    for (var i = 0; i < tasks.length; i++){
        if (tasks[i].id === parseInt(taskId)){
            tasks[i].status = statusSelectEl.value.toLowerCase();
        }
    }
    saveTasks();
}

var dragLeaveHandler = function(event){
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl){
        taskListEl.removeAttribute("style");
    }
}

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

formEl.addEventListener("submit", taskFormHandler);

pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);

pageContentEl.addEventListener("dragstart", dragTaskHandler);

pageContentEl.addEventListener("dragover", dropZoneDragHandler);

pageContentEl.addEventListener("drop", dropTaskHandler);

pageContentEl.addEventListener("dragleave", dragLeaveHandler);