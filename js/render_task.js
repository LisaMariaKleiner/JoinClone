function renderTaskDetails(cardId) {
    let currentTask = tasks[getcardIdIndex(cardId)];
    renderTaskTitle(currentTask);
    renderTaskDescription(currentTask);
    renderTaskDate(currentTask);
    renderTaskPriority(currentTask);
    renderSubtasks(currentTask.subtasks, cardId);
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

function renderAllTasks() {
  updateCard("toDo", "to_do");
  updateCard("inProgress", "in_progress");
  updateCard("awaitFeedback", "await_feedback");
  updateCard("done", "done");
  setTimeout(() => {
    renderAssignedContactsInPreview();
  }, 1000);
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

async function renderAssignedContactsInEditForm(taskId) {
  tasks = JSON.parse(await getItem("tasks"));
  let assignedContacts = tasks[taskId].assignedContacts;
  let assignedContactsEditContainer = document.getElementById('assigned_contacts_edit_container');

  if(assignedContacts.length > 0) {
    for (let index = 0; index < assignedContacts.length; index++) {
      const contact = assignedContacts[index];
      const contactInitials = extractInitials(contact)
      const randomBackground = randomColor();
      assignedContactsEditContainer.innerHTML += createAssignedContact(contactInitials, randomBackground);

    }
  }
}

async function setCheckboxState(cardId) { 
  const tasksAsString = await getItem('tasks');
  tasks = JSON.parse(tasksAsString);

  if(tasks[cardId].subtasks.length > 0) {
    let subTasks = tasks[cardId].subtasks

    for (let index = 0; index < subTasks.length; index++) {
      let element = subTasks[index]; // Element ist hier nicht vergeben aber deklariert?
      if(tasks[cardId].completedSubTasks.includes(index)) {
        let checkbox = document.getElementById(`subtask_checkbox_${index}`)
        checkbox.checked = true;
      }
    }
  }
}

function renderSubtaskProgress(task, taskSubtaskCount, index) {
  let completedSubTasks = task.completedSubTasks;
  let completedSubtasksCount = completedSubTasks.length;
  let subtaskProgressInPercent = Math.trunc(completedSubtasksCount / taskSubtaskCount * 100);

  let subtaskProgressbar = document.getElementById(`subtask_progressbar_task_${index}`);
  subtaskProgressbar.style.width = `${subtaskProgressInPercent}%`;
  
  let subtaskProgressCounter = document.getElementById(`subtask_counter_${index}`);
  subtaskProgressCounter.innerText = completedSubtasksCount + '/' + taskSubtaskCount + ' Subtasks';
}



async function renderAssignedContactsInAddTask(containerId) {
  let addTaskSelectedContactsContainer = document.getElementById(containerId);
  addTaskSelectedContactsContainer.innerHTML = " ";
  for (let index = 0; index < selectedContacts.length; index++) {
    const selectedContact = selectedContacts[index];
    let initials = extractInitials(selectedContact);
    let randomBackground = await getContactBackground(selectedContact);

    addTaskSelectedContactsContainer.innerHTML += createAssignedContact(initials, randomBackground);
  }
}