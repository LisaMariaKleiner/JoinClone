let tasks = [];
let subtasks = [];
let currentDraggedElement;
let subtaskCounter = 0; // Um eindeutige IDs für Subtasks zu erstellen

async function loadTasks() {
  let loadedTasks = JSON.parse(await getItem("tasks"));
  tasks = loadedTasks;
}

function findFreeIdForTasks() {

  /*let maxId = 0; // Für später!
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id >= maxId){
      maxId = tasks[i].id;
    }
  }*/

  for (let index = 0; index < 100; index++) {
    if ((tasks.findIndex(k => k['id'] === index) == -1)){
      return index;
    }
  }
}


function getcardIdIndex(cardId){
  let currentIndex;
    for (let i = 0; i < tasks.length; i++) {
    if (Number(cardId) === tasks[i].id) {
      return currentIndex = i;
    }
  }
}


async function createNewTask() {
  let title = document.getElementById("title_input").value;
  let description = document.getElementById("description_textarea").value;
  let assignedTo = document.getElementById("assigned_to_input").value;
  let date = document.getElementById("date_input").value;
  let taskCategory = document.getElementById("task_category_input").value;
  let subtaskInput = document.getElementById("subtask_category_input");
  let subtaskTitles = subtaskInput.value
    .split("\n")
    .filter((title) => title.trim() !== "");

  subtaskInput = [];
  // Fügt die Subtasks zur Subtasks-Liste hinzu
  subtaskTitles.forEach((subtaskTitle) => {
    subtasks.push({ title: subtaskTitle });
  });


  let newTask = {
    id: findFreeIdForTasks(),
    title: title,
    description: description,
    assignedTo: assignedTo,
    date: date,
    taskCategory: taskCategory,
    subtasks: subtasks,
    category: "toDo",
  };
  tasks.push(newTask);
  await updateTasksInRemoteStorage(tasks);
  clearAddTaskCard();
  moveAddTaskCard("close");

  if (window.location.pathname == "/board.html") {
    await updateHTML();
  }
}

// Onclickfunktion für das "+" beim Subtasks erstellen
document.addEventListener("DOMContentLoaded", function () {
  const addSubtaskButton = document.querySelector(".subtasks img");

  addSubtaskButton.addEventListener("click", () => {
    let subtaskInput = document.getElementById("subtask_category_input");
    let subtaskTitle = subtaskInput.value.trim();
    subtasks.push(subtaskTitle);

    if (subtaskTitle) {
      // Erstellen Sie ein neues Listenelement für den Subtask
      let subtaskItem = document.createElement("li");
      subtaskItem.textContent = subtaskTitle;
      let subtaskList = document.querySelector(".title ul");
      subtaskList.appendChild(subtaskItem);
      subtaskInput.value = "";
    }
  });
});

// Funktion zum Hinzufügen eines Subtasks zur Liste und zum Aktualisieren der Benutzeroberfläche
function addSubtaskToList(subtaskTitle) {
  let subtaskInput = document.getElementById("subtask_category_input");
  subtaskTitle = subtaskTitle.trim();

  if (subtaskTitle) {
    let subtaskElement = createSubtaskElement(subtaskTitle);
    let taskCardOpened = document.getElementById("subtask_container");
    taskCardOpened.appendChild(subtaskElement);
    let currentTask = tasks[tasks.length - 1]; // Nehmen Sie die letzte Aufgabe im Array
    currentTask.subtasks.push({ title: subtaskTitle });

    // Das Eingabefeld leeren
    subtaskInput.value = "";
  }
}

function clearInputFields() {
  document.getElementById("title_input").value = "";
  document.getElementById("description_textarea").value = "";
  document.getElementById("assigned_to_input").value = "";
  document.getElementById("date_input").value = "";
  document.getElementById("task_category_input").value = "";
  document.getElementById("subtask_category_input").value = "";
}

/*async function renderContactsInDatalist() {
  let selectContacts = document.getElementById("select_contacts");
  let usersData = await getItem("users");
  if (usersData) {
    const users = JSON.parse(usersData);
    if (Array.isArray(users)) {
      const currentUser = users[0];
      if (currentUser.contacts && Array.isArray(currentUser.contacts)) {
        const contacts = currentUser.contacts;
        contacts.forEach((contact) => {
          const option = document.createElement("option");
          option.value = `${contact.name} (${contact.initials})`;
          selectContacts.appendChild(option);
        });
      } else {
        console.error("Der aktuelle Benutzer hat keine Kontakte.");
      }
    }
  }
}*/ // Wieder frei geben wenn an  Datalist gearbeitet wird!!!!!

document.addEventListener("DOMContentLoaded", async function () {
  if (isOnSummaryPage()) {
    updateHTML(); // Fügen Sie diesen Aufruf hinzu
  }
});

async function updateHTML(searchTerm = "") {
  await loadTasks();
  if (isOnBoardPage()) {
    await updateCard("toDo", "to_do", searchTerm);
    await updateCard("inProgress", "in_progress", searchTerm);
    await updateCard("awaitFeedback", "await_feedback", searchTerm);
    await updateCard("done", "done", searchTerm);
  }
  await updateTaskCounts();
}

function filterTasks() {
  const searchTerm = document.getElementById("search_input").value;
  if (searchTerm.trim() !== "") {
    updateHTML(searchTerm);
  } else {
    // Wenn das Suchfeld leer ist, zeige alle Aufgaben an
    updateHTML();
  }
}

function taskMatchesSearch(task, searchTerm) {
  const taskText =
    `${task.title} ${task.description} ${task.assignedTo} ${task.date} ${task.taskCategory} ${task.subtaskCategory}`.toLowerCase();
  return taskText.includes(searchTerm.toLowerCase());
}

async function updateCard(category, containerId, searchTerm = "") {
  const filteredTasks = tasks.filter(
    (task) =>
      task["category"] === category && taskMatchesSearch(task, searchTerm)
  );
  document.getElementById(containerId).innerHTML = "";
  for (let index = 0; index < filteredTasks.length; index++) {
    const element = filteredTasks[index];
    document.getElementById(containerId).innerHTML += createTask(element);
  }
}

function startDragging(id) {
  currentDraggedElement = id; // id = 0
  console.log("CurrentDraggedElement is: " + currentDraggedElement);
}

function allowDrop(ev) {
  ev.preventDefault();
}

async function moveTo(category, containerId) {
  tasks[currentDraggedElement]["category"] = category; // tasks[0]['category']
  await updateTasksInRemoteStorage(tasks);
  await updateHTML();
  removeHighlight(containerId);
}

function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

async function updateTasksInRemoteStorage(updatedTasks) {
  const updatedTasksAsString = JSON.stringify(updatedTasks);
  await setItem("tasks", updatedTasksAsString);
}

function slideCardUp() {
  document
    .getElementById("success_feedback")
    .classList.remove("slide_down_without_bg");
  document.getElementById("success_feedback").style.display = "flex";
  document
    .getElementById("success_feedback")
    .classList.add("slide_up_without_bg");
  document.getElementById("success_feedback").style.transform =
    "translateY(0%)";
}

function slideCardDown() {
  document
    .getElementById("success_feedback")
    .classList.remove("slide_up_without_bg");
  document
    .getElementById("success_feedback")
    .classList.add("slide_down_without_bg");
  document.getElementById("success_feedback").style.transform =
    "translateY(100%)";
  setTimeout(() => {
    document.getElementById("success_feedback").style.display = "none";
  }, 500);
  setTimeout(() => {
    window.location.pathname = "/board.html";
  }, 1000);
}

function openTaskDetailsCard(cardId, action) {
  showTaskDetailsCard(action);
  renderTaskDetails(cardId);
  setOnClickEvent(cardId);
}

function showTaskDetailsCard(action) {
  let taskDetailsBackground = document.getElementById("task_card_opened");
  let taskDetailsCard = document.getElementById("current_task_card");
  if (action === "open") {
    openDetailsCard(taskDetailsBackground, taskDetailsCard);
  } else if (action === "close") {
    closeDetailsCard(taskDetailsBackground, taskDetailsCard);
  }
}

function showDropDownMenu(containerId) {
  document.getElementById(containerId).display = "flex";
}

function openDetailsCard(taskDetailsBackground, taskDetailsCard) {
  taskDetailsBackground.style.display = "flex";
  taskDetailsBackground.classList.add("background_fade_in");
  taskDetailsCard.classList.add("slide_in_no_bg_change");
  taskDetailsCard.style.transform = "translate(0%)";
  setTimeout(() => {
    taskDetailsCard.classList.remove("slide_in_no_bg_change");
    taskDetailsBackground.classList.remove("background_fade_in");
  }, 500);
}

function closeDetailsCard(taskDetailsBackground, taskDetailsCard) {
  taskDetailsCard.classList.add("slide_out_no_bg_change");
  taskDetailsBackground.classList.add("background_fade_in");
  taskDetailsCard.style.transform = "translate(200%)";
  setTimeout(() => {
    taskDetailsCard.classList.remove("slide_out_no_bg_change");
    taskDetailsBackground.classList.remove("background_fade_in");
    taskDetailsBackground.style.display = "none";
  }, 500);
}

function renderTaskDetails(cardId) {
  let currentTask = tasks[getcardIdIndex(cardId)];
  renderTaskTitle(currentTask);
  renderTaskDescription(currentTask);
  renderTaskDate(currentTask);
  renderTaskPriority(currentTask);
  renderSubtasks(currentTask.subtasks);
}

function renderSubtasks(subtasks) {
  let subtasksContainer = document.getElementById("subtask_container");
  subtasksContainer.innerHTML = ""; // Leeren Sie den Container, um vorhandene Subtasks zu entfernen.

  for (let index = 0; index < subtasks.length; index++) {
    subtasksContainer.innerHTML += `
    <span>${subtasks[index]}</span
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
  taskDate.innerText = currentTask.date;
}

function renderTaskPriority(currentTask) {
  let taskPriority = document.getElementById("task_priority");
  taskPriority.innerText = currentTask.priority;
}

document.addEventListener("mouseup", function (e) {
  let taskDetailsCard = document.getElementById("current_task_card");
  if (isTaskDetailsCardOpen()) {
    if (!taskDetailsCard.contains(e.target)) {
      showTaskDetailsCard("close");
    }
  }
});

function isTaskDetailsCardOpen() {
  if (isOnBoardPage()) {
    return document.getElementById("task_card_opened").style.display != "none";
  }
}

// Funktion, um die Anzahl der Tasks in einer bestimmten Kategorie zu zählen
function countTasksInCategory(category) {
  return tasks.filter((task) => task.category === category).length;
}

function countTasksInProgress() {
  return countTasksInCategory("inProgress");
}

function countTasksInFeedback() {
  return countTasksInCategory("awaitFeedback");
}

function countTasksToDo() {
  return countTasksInCategory("toDo");
}

function countCompletedTasks() {
  return countTasksInCategory("done");
}

// Funktion zum Aktualisieren der Anzeige der Task-Zahlen in den HTML-Elementen
async function updateTaskCounts() {
  if (isOnSummaryPage()) {
    let tasksCountElement = document.getElementById("tasks_count");
    let progressCountElement = document.getElementById("progress_count");
    let feedbackCountElement = document.getElementById("feedback_count");
    let todoCountElement = document.getElementById("todo_count");
    let doneCountElement = document.getElementById("done_count");
    let totalTasks = tasks.length;
    let inProgressTasks = countTasksInProgress();
    let feedbackTasks = countTasksInFeedback();
    let todoTasks = countTasksToDo();
    let doneTasks = countCompletedTasks();
    tasksCountElement.textContent = totalTasks;
    progressCountElement.textContent = inProgressTasks;
    feedbackCountElement.textContent = feedbackTasks;
    todoCountElement.textContent = todoTasks;
    doneCountElement.textContent = doneTasks;
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  if (isOnSummaryPage()) {
    await updateHTML();
  }
});

document.addEventListener("mouseup", async function (e) {
  if (e.target.id === "assigned_to_input") {
    document.getElementById("assigned_to_datalist").style.display = "flex";
  } else {
    document.getElementById("assigned_to_datalist").style.display = "none";
  }
});

function clearAddTaskCard() {
  subtasks = [];
  let subtaskList = document.querySelector("#subtask_list ul");
  subtaskList.innerHTML = "";
  clearInputFields();
}

async function deleteAllTasks() {
  // Bestätigen Sie zuerst, ob der Benutzer sicher alle Tasks löschen möchte
  const confirmation = confirm("Are you sure you want to delete all tasks?");
  if (!confirmation) {
    return; // Wenn der Benutzer die Aktion nicht bestätigt, brechen Sie die Funktion ab.
  }

  // Löschen Sie alle Tasks, indem Sie das `tasks` Array leeren
  tasks = [];

  // Aktualisieren Sie die Tasks in der Remote-Speicherung
  await setItem("tasks", JSON.stringify(tasks));

  // Aktualisieren Sie die Anzeige
  await updateHTML();
}

async function showTaskEditForm(taskId) {
  const taskDetails = document.getElementById('task_details');
  const taskEditForm = document.getElementById('edit_task_card');

  taskDetails.style.display = 'none';
  taskEditForm.style.display = 'flex';
  document.querySelector('body').style.overflow = 'hidden';
  await renderTaskEditForm(taskId);
}

async function renderTaskEditForm(taskId) {
  tasks = JSON.parse(await getItem('tasks'))
  const taskTitle = tasks[taskId].title
  const taskDescription = tasks[taskId].description
  const taskDueDate = tasks[taskId].date
  const taskTitleInput = edit_task_title;
  const taskDescriptionInput = edit_task_description;
  const taskDateInput = edit_task_date;

  taskTitleInput.setAttribute('value', taskTitle);
  taskDescriptionInput.value = taskDescription;
  taskDateInput.setAttribute('value', taskDueDate);
}

function setOnClickEvent(cardId) {
  document.getElementById('open_task_delete')
  .setAttribute('onclick', `deleteTask(${cardId}); return false;`)
  document.getElementById('open_task_edit')
    .setAttribute('onclick', `showTaskEditForm(${cardId})`);
  document.getElementById('edit_task_card_form')
    .setAttribute('onsubmit', `saveTask(${cardId}); return false`);
}

async function saveTask(cardId) {
  const remoteStorageTasksAsString = await getItem("tasks");
  const editedTaskTitle = edit_task_title.value;
  const editedTaskDescription = edit_task_description.value;
  const editedTaskDate = edit_task_date.value;

  if(remoteStorageTasksAsString) {
    const remoteStorageTasks = JSON.parse(remoteStorageTasksAsString);

    const currentTask = remoteStorageTasks[cardId];
    currentTask.title = editedTaskTitle;
    currentTask.description = editedTaskDescription;
    currentTask.date = editedTaskDate;
  
    await updateTasksInRemoteStorage(currentTask);
    clearTaskEditForm();
  };
}

async function updateTasksInRemoteStorage(updatedTask) {
  tasks = await getItem('tasks');
  tasks = JSON.parse(tasks);
  if (tasks) {
    const updatedTaskId = updatedTask.id;
    const taskIndex = tasks.findIndex(
      (t) => t.id === updatedTaskId
    );

    if (taskIndex !== -1) {
      tasks[taskIndex] = updatedTask;
      const tasksAsString = JSON.stringify(tasks);
      await setItem('tasks', tasksAsString);
    }
  }
}

function clearTaskEditForm() {
  edit_task_title.value = '';
  edit_task_description.value = '';
  edit_task_date.value = '';
}

async function deleteTask(cardId) {
  const remoteStorageTasksAsString = await getItem("tasks");
  
  if (remoteStorageTasksAsString) {
    const remoteStorageTasks = JSON.parse(remoteStorageTasksAsString);
    if (getTaskIdIndex(cardId) > -1) {
      remoteStorageTasks.splice(getTaskIdIndex(cardId), 1);
      const remoteStorageTasksAsString = JSON.stringify(remoteStorageTasks);
      await setItem("tasks", remoteStorageTasksAsString);
      location.reload();
    } else {
      console.warn('Ungültiger TaskIndex.')
    }

  } else {
    console.warn('Task konnte im Remote Storage nicht gefunden werden.')
  }

}

function getTaskIdIndex(taskId) {
  let currentIndex;
  for(let i = 0; i < tasks.length; i++) {
    if (Number(taskId) === tasks[i].id) {
      return currentIndex = i;
    }
  }
}