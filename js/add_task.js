let tasks = [];
let subtasks = [];
let currentDraggedElement;
let subtaskCounter = 0; // Um eindeutige IDs für Subtasks zu erstellen
let completedSubTasks = [];
let selectedContacts = [];

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
  let taskOwner = JSON.parse(localStorage.getItem('user')).name;
  let date = document.getElementById("date_input").value;
  let taskCategory = document.getElementById("task_category_input").value;
  let subtaskInput = document.getElementById("subtask_category_input");
  let checkedPriority = getCheckedPriorityCheckbox();
  let subtaskTitles = subtaskInput.value
    .split("\n")
    .filter((title) => title.trim() !== "");
  subtaskInput = [];
  subtaskTitles.forEach((subtaskTitle) => {
    subtasks.push({ title: subtaskTitle });
  });
  let newTask = {
    id: findFreeIdForTasks(),
    title: title,
    description: description,
    taskOwner: taskOwner,
    assignedContacts: selectedContacts,
    date: date,
    priority: checkedPriority,
    taskCategory: taskCategory,
    subtasks: subtasks,
    completedSubTasks: completedSubTasks,
    category: "toDo",
  };

  tasks.push(newTask);
  await updateTasksInRemoteStorage(tasks);
  clearAddTaskCard();
  moveAddTaskCard("close");
  selectedContacts = [];
  await renderAssignedContacts();
  if (window.location.pathname == "/board.html") {
    await updateHTML();
    renderAssignedContactsInPreview();
  }
}

function getCheckedPriorityCheckbox() {
  const checkboxes = [
    "prio_urgent",
    "prio_medium",
    "prio_low",
    "edit_prio_urgent",
    "edit_prio_medium",
    "edit_prio_low",
  ];
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
  let checkboxes = [
    "prio_urgent",
    "prio_medium",
    "prio_low",
    "edit_prio_urgent",
    "edit_prio_medium",
    "edit_prio_low",
  ];
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
  const tasksAsString = await getItem("tasks");
  tasks = JSON.parse(tasksAsString);
  if (checkbox.checked) {
    tasks[cardId].completedSubTasks.push(index);
    await updateTaskInRemoteStorage(tasks[cardId]);
  } else if (!checkbox.checked) {
    tasks[cardId].completedSubTasks.splice(
      tasks[cardId].completedSubTasks.indexOf(index),
      1
    );
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
async function renderContactsInDatalist(containerId) {
  let contactDatalist = document.getElementById(containerId);
  contactDatalist.innerHTML = "";
  let usersData = await getItem("users");
  if (usersData) {
    let users = JSON.parse(usersData);
    if (Array.isArray(users)) {
      const currentUser = users.find(u => u.email === JSON.parse(localStorage.getItem('user')).email);
      if (currentUser.contacts && Array.isArray(currentUser.contacts)) {
        let contacts = currentUser.contacts;
        let index = 0;
        contacts.forEach(async function (contact) {
          console.log(contact);
          const randomBackground = contact.contactBackgroundColor;
          contactDatalist.innerHTML += `
            <div id="datalist_contact_container_${index}" class="datalist_contact_container">
              <div class="initials_in_datalist" style="background-color: ${randomBackground}">${extractInitials(
            contact.name
          )}</div>
              <div class="name_in_datalist">${contact.name}</div>
              <div class="checkbox_datalist"><input type="checkbox"></div>
            </div>
          `;
          index++;
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


// Event-Handler für die Checkboxen
document.addEventListener("change", function (event) {
  console.log(event.target);
  if (event.target.type === "checkbox") {
    let selectedContactName = getSelectedContactName(event.target);
    if (selectedContactName) {
      // Überprüfen, ob der Kontakt gültig ist
      if (event.target.checked) {
        selectedContacts.push(selectedContactName);
        renderAssignedContactsInAddTask('add_task_selected_contacts_container');
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
  let tasksAsString = await getItem("tasks");
  let tasksAsJson = JSON.parse(tasksAsString);
  let assignedContacts = tasksAsJson[taskId].assignedContacts;
  let assignedContactsContainer = document.getElementById("assigned_contacts");
  assignedContactsContainer.innerHTML = "";

  assignedContacts.forEach(async function (contactName) {
      let initials = extractInitials(contactName);
      let randomBackground = await getContactBackground(contactName);
      getContactBackground(contactName);
      assignedContactsContainer.innerHTML += createAssignedContactInDetails(contactName, initials, randomBackground);
    });
}

async function getContactBackground(contactName) {
  let usersAsString = await getItem("users");
  let usersAsJson = JSON.parse(usersAsString);
  let currentUser = localStorage.getItem("user");
  currentUser = JSON.parse(currentUser);

  currentUser = usersAsJson.find(u => u.email === currentUser.email);
  let userContacts = currentUser.contacts;
  let contact = userContacts.find(c => c.name === contactName);
  let contactBackgroundColor = contact.contactBackgroundColor;
  return contactBackgroundColor;
}

function getContactBackgroundFromTaskOwner(contactName, userContacts) {
  let contact = userContacts.find(c => c.name === contactName);
  let contactBackgroundColor = contact.contactBackgroundColor;
  return contactBackgroundColor;
}



function renderAssignedContactsInPreview() {
  for (let index = 0; index < tasks.length; index++) {
    const task = tasks[index];
    loadAllAssignedContacts(task, index);
  }
}

function loadAllAssignedContacts(task, taskIndex) {
  let assignedContactsContainer = document.getElementById(
    `task_member_container_${taskIndex}`
  );
  assignedContactsContainer.innerHTML = '';
  let userContacts = checkWhichuserIsTaskOwner(task);
  for (
    let assignedContactIndex = 0;
    assignedContactIndex < task.assignedContacts.length;
    assignedContactIndex++
  ) {
    const assignedContact = task.assignedContacts[assignedContactIndex];
    const randomBackground = getContactBackgroundFromTaskOwner(assignedContact, userContacts);
    const INITIAL =
      assignedContact.split(" ")[0].charAt(0).toUpperCase() +
      assignedContact.split(" ")[1].charAt(0).toUpperCase();

    assignedContactsContainer.innerHTML += `
      <div class="assigned_initials_board" style="background-color: ${randomBackground}">${INITIAL}</div>
    `;
  }
    
}

function checkWhichuserIsTaskOwner(task) {
  const taskOwner = task.taskOwner;
  for (let index = 0; index < users.length; index++) {
    const user = users[index];
    if(user.name === taskOwner) {
      return user.contacts;
    }
  }
}


/* --------------------------------*/

document.addEventListener("DOMContentLoaded", async function () {
  if (isOnSummaryPage()) {
    await updateHTML();
  } else if (isOnBoardPage()) {
    await updateHTML();
  }
});

async function updateHTML(searchTerm = "") {
  await loadTasks();
  if (isOnBoardPage()) {
    updateCard("toDo", "to_do", searchTerm);
    updateCard("inProgress", "in_progress", searchTerm);
    updateCard("awaitFeedback", "await_feedback", searchTerm);
    updateCard("done", "done", searchTerm);
  }
  await showCompletedSubtaskCount();
}

function updateCard(category, containerId, searchTerm = "") {
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
    document
      .getElementById(`task_urgency_information_${element["id"]}`)
      .classList.add(getCheckedCheckbox(element));
  }
}

async function filterTasks() {
  const searchTerm = document.getElementById("search_input").value;
  if (searchTerm.trim() !== "") {
    await updateHTML(searchTerm);
  } else {
    await updateHTML(); // Wenn das Suchfeld leer ist, zeige alle Aufgaben an
  }
}

function taskMatchesSearch(task, searchTerm) {
  const taskText =
    `${task.title} ${task.description} ${task.assignedTo} ${task.date} ${task.taskCategory} ${task.subtaskCategory}`.toLowerCase();
  return taskText.includes(searchTerm.toLowerCase());
}

function currentUserIsTaskOwner(task) {
  let currentUser = JSON.parse(localStorage.getItem('user'));
  if(task.taskOwner === currentUser.name) {
    return true;
  }
}

function currentUserIsAssignedToTask(task) {
  let currentUser = JSON.parse(localStorage.getItem('user'));
  for (let index = 0; index < task.assignedContacts.length; index++) {
    const contact = task.assignedContacts[index];
    if(contact === currentUser.name) {
      return true;
    }
    
  }
}

function checkForSubtasks(element) {
  if (element.subtasks.length === 0) {
    document.getElementById(
      `subtask_progress_container_${element["id"]}`
    ).style.display = "none";
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
  renderAssignedContactsInPreview();
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
  if (action === "open") {
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
    document.querySelector("body").style.overflow = "hidden";
  } else if (action === "close") {
    closeDetailsCard(taskDetailsBackground, taskDetailsCard);
    document.querySelector("body").style.overflow = "visible";
  }
}

function showDropDownMenu(containerId, inputId) {
  console.log(containerId);
  document.getElementById(containerId).style.display = "flex";
  document.getElementById(inputId).value = " ";
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
    document.getElementById("task_details").style.display = "flex";
    document.getElementById("edit_task_card").style.display = "none";
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

// Besserer Eventlistener muss aber noch angepasst werden
document.addEventListener("mouseup", async function (e) {
  const datalistContainer = document.getElementById("assigned_to_datalist");
  if (e.target.id === "assigned_to_input") {
      datalistContainer.style.display = "flex"; // Das Input-Feld wurde geklickt, zeige den Container an
  } else if (datalistContainer.contains(e.target) && e.target.type === "checkbox") {
      e.preventDefault();// Das Klicken erfolgte innerhalb des Containers auf eine Checkbox, div nicht schließen
      // e.target.checked = !e.target.checked; // Aktualisiere den Status der Checkbox optisch (nur wenn gewünscht)
  } else if (datalistContainer.contains(e.target)){
    e.preventDefault();
  } 
  else {
      datalistContainer.style.display = "none"; // Das Klicken erfolgte außerhalb des Containers, div schließen
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
  await setItem("tasks", JSON.stringify(tasks)); // Aktualisieren Sie die Tasks in der Remote-Speicherung

  // Aktualisieren Sie die Anzeige
  await updateHTML();
}

function setOnClickEvent(cardId) {
  document
    .getElementById("open_task_delete")
    .setAttribute("onclick", `deleteTask(${cardId}); return false;`);
  document
    .getElementById("open_task_edit")
    .setAttribute("onclick", `showTaskEditForm(${cardId}); getAssignedContacts(${cardId})`);
  document
    .getElementById("edit_task_card_form")
    .setAttribute("onsubmit", `saveTask(${cardId}); return false`);
}

async function getAssignedContacts(taskId) {
  let currentTask = tasks[taskId];
  selectedContacts = currentTask.assignedContacts;

  await renderAssignedContactsInAddTask("assigned_contacts_edit_container")
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

function getTaskIdIndex(taskId) {
  let currentIndex;
  for (let i = 0; i < tasks.length; i++) {
    if (Number(taskId) === tasks[i].id) {
      return (currentIndex = i);
    }
  }
}

async function showCompletedSubtaskCount() {
  for (let index = 0; index < tasks.length; index++) {
    const task = tasks[index];
    let taskSubtaskCount = task.subtasks.length;
    if (taskSubtaskCount > 0) {
      renderSubtaskProgress(task, taskSubtaskCount, index);
    }
  }
}