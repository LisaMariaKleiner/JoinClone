let tasks = [];
let subtasks = [];
let currentDraggedElement;
let subtaskCounter = 0; // Um eindeutige IDs für Subtasks zu erstellen
let completedSubTasks = [];
let selectedContacts = [];

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
    if (tasks.findIndex((k) => k["id"] === index) == -1) {
      return index;
    }
  }
}

function getcardIdIndex(cardId) {
  let currentIndex;
  for (let i = 0; i < tasks.length; i++) {
    if (Number(cardId) === tasks[i].id) {
      return (currentIndex = i);
    }
  }
}

async function createNewTask() {
  let title = document.getElementById("title_input").value;
  let description = document.getElementById("description_textarea").value;
  let date = document.getElementById("date_input").value;
  let taskCategory = document.getElementById("task_category_input").value;
  let subtaskInput = document.getElementById("subtask_category_input");
  let checkedPriority = getCheckedPriorityCheckbox();
  
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
    date: date,
    priority: checkedPriority,
    taskCategory: taskCategory,
    subtasks: subtasks,
    completedSubTasks: completedSubTasks,
    category: "toDo",
  };
  // Fügt die ausgewählten Kontakte zur Aufgabe hinzu
  newTask.assignedContacts = selectedContacts
  // Speichert die zugewiesenen Kontakte im lokalen Speicher
  saveAssignedContacts(newTask.id, selectedContacts);
  tasks.push(newTask);
  await updateTasksInRemoteStorage(tasks);
  clearAddTaskCard();
  moveAddTaskCard("close");
  selectedContacts = [];

  await renderAssignedContacts(newTask.id);
  if (window.location.pathname == "/board.html") {
    await updateHTML();
  }
}

function getCheckedPriorityCheckbox() {
  const checkboxes = ["prio_urgent", "prio_medium", "prio_low", "edit_prio_urgent", "edit_prio_medium", "edit_prio_low"];
  for (let index = 0; index < checkboxes.length; index++) {
    const element = checkboxes[index];
    const priority = element.split("_");
    if (priority.length === 3 && document.getElementById(element).checked) {
      return priority[2];
    } else if (document.getElementById(element).checked) {
      return priority[1];
    }
  }
}

function disableOtherCheckboxes(checkboxId) {
  let checkboxes = ["prio_urgent", "prio_medium", "prio_low", "edit_prio_urgent", "edit_prio_medium", "edit_prio_low"];
  checkboxes.forEach(function (id) {
    if (id !== checkboxId) {
      const checkbox = document.getElementById(id);
      if (checkbox) {
        checkbox.checked = false;
      }
    }
  });
}

// EventListener für die Checkboxen
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("prio_urgent")
    .addEventListener("change", function () {
      if (this.checked) {
        disableOtherCheckboxes("prio_urgent");
      }
    });
  document
    .getElementById("prio_medium")
    .addEventListener("change", function () {
      if (this.checked) {
        disableOtherCheckboxes("prio_medium");
      }
    });
  document.getElementById("prio_low").addEventListener("change", function () {
    if (this.checked) {
      disableOtherCheckboxes("prio_low");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Edit Task Card - Priority Checkboxen
  document
  .getElementById("edit_prio_urgent")
  .addEventListener("change", function () {
    if (this.checked) {
      disableOtherCheckboxes("edit_prio_urgent");
    }
    });
  document
    .getElementById("edit_prio_medium")
    .addEventListener("change", function () {
      if (this.checked) {
        disableOtherCheckboxes("edit_prio_medium");
      }
    });
  document.getElementById("edit_prio_low").addEventListener("change", function () {
    if (this.checked) {
      disableOtherCheckboxes("edit_prio_low");
    }
  });
})

// Onclickfunktion für das "+" beim Subtasks erstellen
document.addEventListener("DOMContentLoaded", function () {
  let addSubtaskButton = document.querySelector(".subtasks img");
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

async function handleCheckBoxState(index, cardId) {
  let checkbox = document.getElementById(`subtask_checkbox_${index}`);
  const tasksAsString = await getItem('tasks');
  tasks = JSON.parse(tasksAsString);
  if(checkbox.checked) {
    tasks[cardId].completedSubTasks.push(index);
    await updateTaskInRemoteStorage(tasks[cardId]);
  } else if (!checkbox.checked) {
    tasks[cardId].completedSubTasks.splice(tasks[cardId].completedSubTasks.indexOf(index), 1)
    await updateTaskInRemoteStorage(tasks[cardId]);
  }
}

// Funktion zum Hinzufügen eines Subtasks zur Liste und zum Aktualisieren der Benutzeroberfläche
function addSubtaskToList(subtaskTitle) {
  let subtaskInput = document.getElementById("subtask_category_input");
  subtaskTitle = subtaskTitle.trim();
  if (subtaskTitle) {
    let subtaskElement = createSubtaskElement(subtaskTitle);
    let taskCardOpened = document.getElementById("subtask_container");
    taskCardOpened.appendChild(subtaskElement);
    let currentTask = tasks[tasks.length - 1]; // Nimmt letzte Aufgabe im Array
    currentTask.subtasks.push({ title: subtaskTitle });
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
  document.getElementById("prio_urgent").checked = false;
  document.getElementById("prio_medium").checked = false;
  document.getElementById("prio_low").checked = false;
}

/* =============================== DATA LIST FUNCTIONS =============================*/ 


// Rendert die vorhandenen Contacte in die Datalist bei Add new Task
async function renderContactsInDatalist() {
  let contactDatalist = document.getElementById("contact_datalist");
  contactDatalist.innerHTML = "";
  let usersData = await getItem("users");
  if (usersData) {
    let users = JSON.parse(usersData);
    if (Array.isArray(users)) {
      const currentUser = users[0];
      if (currentUser.contacts && Array.isArray(currentUser.contacts)) {
        let contacts = currentUser.contacts;
        contacts.forEach((contact) => {
          // Zufällige Hintergrundfarbe generieren
          const randomBackground = randomColor();

          contactDatalist.innerHTML += `
            <div class="datalist_contact_container">
              <div class="initials_in_datalist" style="background-color: ${randomBackground}">${extractInitials(contact.name)}</div>
              <div class="name_in_datalist">${contact.name}</div>
              <div class="checkbox_datalist"><input type="checkbox"></div>
            </div>
          `;
        });
      } else {
        console.error("Der aktuelle Benutzer hat keine Kontakte.");
      }
    }
  }
}

// Generiert eine random Backgroundcolor für die Initials
function randomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Funktion zum Extrahieren der Initialen
function extractInitials(name) {
  if (name) {
    let words = name.split(" ");
    let initials = "";
    for (let i = 0; i < words.length; i++) {
      initials += words[i].charAt(0).toUpperCase();
    }
    return initials;
  } else {
    return "";
  }
}


// Funktion zum Speichern der zugewiesenen Kontakte im lokalen Speicher
function saveAssignedContacts(taskId, assignedContacts) {
  let key = `assignedContacts_${taskId}`;
  let assignedContactsJSON = JSON.stringify(assignedContacts);
  localStorage.setItem(key, assignedContactsJSON);
}

// Funktion zum Laden der zugewiesenen Kontakte aus dem lokalen Speicher
function loadAssignedContacts(taskId) {
  let key = `assignedContacts_${taskId}`;
  let assignedContactsJSON = localStorage.getItem(key);
  if (assignedContactsJSON) {
    return JSON.parse(assignedContactsJSON);
  }
  return [];
}





// Event-Handler für die Checkboxen
document.addEventListener("change", function (event) {
  if (event.target.type === "checkbox") {
    let selectedContactName = getSelectedContactName(event.target);
    if (selectedContactName) { // Überprüfen, ob der Kontakt gültig ist
      if (event.target.checked) {
        selectedContacts.push(selectedContactName);
      } else {
        let index = selectedContacts.indexOf(selectedContactName);
        if (index !== -1) {
          selectedContacts.splice(index, 1);
        }
      }
    }
  }
});



function getSelectedContactName(checkbox) {
  let container = checkbox.closest(".datalist_contact_container");
  if (container) {
    let contactNameElement = container.querySelector(".name_in_datalist");
    if (contactNameElement) {
      return contactNameElement.textContent;
    }
  }
}


async function renderAssignedContacts(taskId) {
  let assignedContacts = loadAssignedContacts(taskId);
  let assignedContactsContainer = document.getElementById("assigned_contacts");
  assignedContactsContainer.innerHTML = "";

  assignedContacts.forEach((contactName) => {
    let initials = extractInitials(contactName);
    let randomBackground = randomColor(); // Zufällige Hintergrundfarbe generieren
    assignedContactsContainer.innerHTML += `
      <div class="assigned_contact">
        <div class="assigned_initials" style="background-color: ${randomBackground}">${initials}</div>
        <div class="assigned_name">${contactName}</div>
      </div>
    `;
  });
}

async function renderAssignedContactsInPreview() {
  let tasksAsString = await getItem('tasks');
  let tasksAsJson = JSON.parse(tasksAsString);

  for (let index = 0; index < tasksAsJson.length; index++) {
    const task = tasksAsJson[index];
    const taskAssignedContacts = task.assignedContacts;
    loadAllAssignedContacts(taskAssignedContacts, index);
  }
}

function loadAllAssignedContacts(taskAssignedContacts, taskIndex) {

  let assignedContactsContainer = document.getElementById(`task_member_container_${taskIndex}`);

  for (let assignedContactIndex = 0; assignedContactIndex < taskAssignedContacts.length; assignedContactIndex++) {
    let randomBackground = randomColor();

    const assignedContact = taskAssignedContacts[assignedContactIndex];
    const INITIAL = assignedContact.split(' ')[0].charAt(0).toUpperCase() + assignedContact.split(' ')[1].charAt(0).toUpperCase();

    assignedContactsContainer.innerHTML += `
      <div class="assigned_initials_board" style="background-color: ${randomBackground}">${INITIAL}</div>
    `;
  }
}



/* --------------------------------*/


document.addEventListener("DOMContentLoaded", async function () {
  if (isOnSummaryPage()) {
    updateHTML();
  } else if (isOnBoardPage()) {
    await updateHTML(); 
    }
});


async function updateHTML(searchTerm = "",) {
  await loadTasks();
  if (isOnBoardPage()) {
    await updateCard("toDo", "to_do", searchTerm);
    await updateCard("inProgress", "in_progress", searchTerm);
    await updateCard("awaitFeedback", "await_feedback", searchTerm);
    await updateCard("done", "done", searchTerm);
  }
  await updateTaskCounts();
  await renderAssignedContacts();
  await showCompletedSubtaskCount();
}

async function filterTasks() {
  const searchTerm = document.getElementById("search_input").value;
  if (searchTerm.trim() !== "") {
    await updateHTML(searchTerm);
  } else {
    await updateHTML();// Wenn das Suchfeld leer ist, zeige alle Aufgaben an
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
    checkForSubtasks(element);
    checkForPriorityClasses();
    document.getElementById(`task_urgency_information_${element['id']}`).classList.add(getCheckedCheckbox(element));
  }
}

function checkForSubtasks(element) {
  if(element.subtasks.length === 0) {
    document.getElementById(`subtask_progress_container_${element['id']}`).style.display = 'none';
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

async function openTaskDetailsCard(cardId, action) {
  showTaskDetailsCard(action);
  if(action === 'open') {
    await renderAssignedContacts(cardId);
    renderTaskDetails(cardId);
    setOnClickEvent(cardId);
    await setCheckboxState(cardId);
  }
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
  taskDetailsBackground.classList.add("background_fade_in");
  taskDetailsCard.classList.add("slide_in_no_bg_change");
  taskDetailsBackground.style.display = "flex";
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
    document.getElementById('task_details').style.display = 'flex';
    document.getElementById('edit_task_card').style.display = 'none';
  }, 500);
}

 
function getCheckedCheckbox(currentTask) {
  const currentTaskPriority = currentTask.priority;
  if (currentTaskPriority === "urgent") {
    return "priority_urgent";
  } else if (currentTaskPriority === "medium") {
    return "priority_medium";
  } else if (currentTaskPriority === "low") {
    return "priority_low";
  }
}

function checkForPriorityClasses() {
  let priorityImageContainer = document.getElementById("task_priority_image");
  if (priorityImageContainer.classList.contains("priority_urgent")) {
    task_priority_image.classList.remove("priority_urgent");
  } else if (priorityImageContainer.classList.contains("priority_medium")) {
    task_priority_image.classList.remove("priority_medium");
  } else if (priorityImageContainer.classList.contains("priority_low")) {
    task_priority_image.classList.remove("priority_low");
  }
}

/*function createTaskPriority(currentTask) {
  let taskPriority =
    currentTask.priority.charAt(0).toUpperCase() +
    currentTask.priority.slice(1);
  return taskPriority;
}*/
// Lieber Checken ob Priority überhaupt gegeben ist????
function createTaskPriority(currentTask) {
  if (currentTask && currentTask.priority) {
    let taskPriority =
      currentTask.priority.charAt(0).toUpperCase() +
      currentTask.priority.slice(1);
    return taskPriority;
  } else {
    return "Standard-Priorität";
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
  const confirmation = confirm("Are you sure you want to delete all tasks?");
  if (!confirmation) {
    return; // Wenn der Benutzer die Aktion nicht bestätigt, brechen Sie die Funktion ab.
  }
  tasks = [];
  await setItem("tasks", JSON.stringify(tasks));// Aktualisieren Sie die Tasks in der Remote-Speicherung

  // Aktualisieren Sie die Anzeige
  await updateHTML();
}

async function showTaskEditForm(taskId) {
  const taskDetails = document.getElementById("task_details");
  const taskEditForm = document.getElementById("edit_task_card");
  taskDetails.style.display = "none";
  taskEditForm.style.display = "flex";
  document.querySelector("body").style.overflow = "hidden";
  await renderTaskEditForm(taskId);
  await renderAssignedContactsInEditForm(taskId);
}



function setEditPrioritySelection(taskPriority) {
  let taskPrioritySelector = document.getElementById(
    `edit_prio_${taskPriority}`
  );
  taskPrioritySelector.checked = true;
}

function setOnClickEvent(cardId) {
  document
    .getElementById("open_task_delete")
    .setAttribute("onclick", `deleteTask(${cardId}); return false;`);
  document
    .getElementById("open_task_edit")
    .setAttribute("onclick", `showTaskEditForm(${cardId})`);
  document
    .getElementById("edit_task_card_form")
    .setAttribute("onsubmit", `saveTask(${cardId}); return false`);
}

async function saveTask(cardId) {
  const remoteStorageTasksAsString = await getItem("tasks");
  const editedTaskTitle = edit_task_title.value;
  const editedTaskDescription = edit_task_description.value;
  let checkedPriority = getCheckedPriorityCheckbox();
  const editedTaskDate = edit_task_date.value;
  if (remoteStorageTasksAsString) {
    const remoteStorageTasks = JSON.parse(remoteStorageTasksAsString);
    const currentTask = remoteStorageTasks[cardId];
    currentTask.title = editedTaskTitle;
    currentTask.description = editedTaskDescription;
    currentTask.date = editedTaskDate;
    currentTask.priority = checkedPriority;

    await updateTaskInRemoteStorage(currentTask);
    clearTaskEditForm();
    location.reload();
  }
}

async function updateTaskInRemoteStorage(updatedTask) {
  tasks = await getItem("tasks");
  tasks = JSON.parse(tasks);
  if (tasks) {
    const updatedTaskId = updatedTask.id;
    const taskIndex = tasks.findIndex((t) => t.id === updatedTaskId);
    if (taskIndex !== -1) {
      tasks[taskIndex] = updatedTask;
      const tasksAsString = JSON.stringify(tasks);
      await setItem("tasks", tasksAsString);
    }
  }
}

function clearTaskEditForm() {
  edit_task_title.value = "";
  edit_task_description.value = "";
  edit_task_date.value = "";
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
      console.warn("Ungültiger TaskIndex.");
    }
  } else {
    console.warn("Task konnte im Remote Storage nicht gefunden werden.");
  }
}

function getTaskIdIndex(taskId) {
  let currentIndex;
  for (let i = 0; i < tasks.length; i++) {
    if (Number(taskId) === tasks[i].id) {
      return (currentIndex = i);
    }
  }
}

async function showCompletedSubtaskCount() {
  let tasksAsString = await getItem('tasks');
  let tasksAsJson = JSON.parse(tasksAsString);

  for (let index = 0; index < tasksAsJson.length; index++) {
    const task = tasksAsJson[index];
    let taskSubtaskCount = task.subtasks.length;
    if(taskSubtaskCount > 0) {
      renderSubtaskProgress(task, taskSubtaskCount, index);
    }
  }
}