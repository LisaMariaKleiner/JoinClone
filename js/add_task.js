let tasks = [];
let subtasks = [];
let currentDraggedElement;
let subtaskCounter = 0; // Um eindeutige IDs für Subtasks zu erstellen

async function loadTasks() {
  let loadedTasks = JSON.parse(await getItem("tasks"));
  tasks = loadedTasks;
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

  // Fügen Sie die Subtasks zur Subtasks-Liste hinzu
  subtaskTitles.forEach((subtaskTitle) => {
    subtasks.push({ title: subtaskTitle });
  });

  let newTask = {
    id: tasks.length,
    title: title,
    description: description,
    assignedTo: assignedTo,
    date: date,
    taskCategory: taskCategory,
    subtasks: subtasks,
    category: "toDo",
  };
  tasks.push(newTask);
  clearInputFields();
  await updateTasksInRemoteStorage(tasks);
  moveAddTaskCard("close");
  subtasks = [];

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

      // Holen Sie das parent <ul>-Element
      let subtaskList = document.querySelector(".title ul");

      // Fügen Sie den Subtask der Liste hinzu
      subtaskList.appendChild(subtaskItem);

      // Das Eingabefeld leeren
      subtaskInput.value = "";
    }
  });
});


// Funktion zum Hinzufügen eines Subtasks zur Liste und zum Aktualisieren der Benutzeroberfläche
function addSubtaskToList(subtaskTitle) {
  let subtaskInput = document.getElementById("subtask_category_input");
  subtaskTitle = subtaskTitle.trim();

  if (subtaskTitle) {
    // Erstellen Sie ein Subtask-Element mit dem Subtask-Titel
    let subtaskElement = createSubtaskElement(subtaskTitle);

    // Holen Sie das Element mit der ID "task_card_opened"
    let taskCardOpened = document.getElementById("subtask_container");

    // Fügen Sie das Subtask-Element zur "task_card_opened"-Karte hinzu
    taskCardOpened.appendChild(subtaskElement);

    // Fügen Sie den Subtask auch zum `subtasks`-Array der aktuellen Aufgabe hinzu
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
  let currentTask = tasks[cardId];
  renderTaskTitle(currentTask);
  renderTaskDescription(currentTask);
  renderTaskDate(currentTask);
  renderTaskPriority(currentTask);
  renderSubtasks(currentTask.subtasks);
}

function renderSubtasks(subtasks) {
  let subtasksContainer = document.getElementById('subtask_container');
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

