function renderTaskDetails(cardId) {
    let currentTask = tasks[getcardIdIndex(cardId)];
    renderTaskTitle(currentTask);
    renderTaskDescription(currentTask);
    renderTaskDate(currentTask);
    renderTaskPriority(currentTask);
    renderSubtasks(currentTask.subtasks, cardId - 1);
  }
  
function renderSubtasks(subtasks, cardId) {
  let subtasksContainer = document.getElementById("subtask_container");
  subtasksContainer.innerHTML = ""; 

  for (let index = 0; index < subtasks.length; index++) {
    subtasksContainer.innerHTML += 
    `<div class="subtask">
      <input type="checkbox" name=""  class="subtask_checkbox" id="subtask_checkbox_${index}" onclick="handleCheckBoxState(${index}, ${cardId})">
      <label for="subtask_checkbox_${index}"></label>
      <span>${subtasks[index]}</span>                  
    </div>
    `;
  }
}


function renderTaskTitle(currentTask) {
  let taskTitle = document.getElementById("task_title");
  taskTitle.innerText = currentTask.title;
}

function renderTaskDescription(currentTask) {
  let taskDescription = document.getElementById("task_description");
  taskDescription.innerText = currentTask.description;
}

function renderTaskDate(currentTask) {
  let taskDate = document.getElementById("task_date");
  let currentTaskDateSplitted = currentTask.date.split("-");
  let currentTaskDateFormatted =
    currentTaskDateSplitted[2] +
    "/" +
    currentTaskDateSplitted[1] +
    "/" +
    currentTaskDateSplitted[0];
  taskDate.innerText = currentTaskDateFormatted;
}

function renderTaskPriority(currentTask) {
  let taskPriorityContainer = document.getElementById("task_priority");
  let taskPriorityImageContainer = document.getElementById(
    "task_priority_image"
  );
  checkForPriorityClasses();
  taskPriorityImageContainer.classList.add(getCheckedCheckbox(currentTask));
  taskPriorityContainer.innerText = createTaskPriority(currentTask);
}

async function renderTaskEditForm(taskId) {
  tasks = JSON.parse(await getItem("tasks"));
  const taskTitle = tasks[taskId].title;
  const taskDescription = tasks[taskId].description;
  const taskDueDate = tasks[taskId].date;
  const taskPriority = tasks[taskId].priority;
  const taskTitleInput = edit_task_title;
  const taskDescriptionInput = edit_task_description;
  const taskDateInput = edit_task_date;

  taskTitleInput.setAttribute("value", taskTitle);
  taskDescriptionInput.value = taskDescription;
  taskDateInput.setAttribute("value", taskDueDate);
  setEditPrioritySelection(taskPriority);
}

async function setCheckboxState(cardId) { 
  const tasksAsString = await getItem('tasks');
  tasks = JSON.parse(tasksAsString);

  const subTasks = tasks[cardId].subtasks

  for (let index = 0; index < subTasks.length; index++) {
    const element = subTasks[index];
    if(tasks[cardId].completedSubTasks.includes(index)) {
      let checkbox = document.getElementById(`subtask_checkbox_${index}`)
      checkbox.checked = true;
    }
  }

}