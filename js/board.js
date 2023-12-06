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
    await initBoard();
}

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
    document
      .getElementById("edit_prio_low")
      .addEventListener("change", function () {
        if (this.checked) {
          disableOtherCheckboxes("edit_prio_low");
        }
      });
  });

  document.addEventListener("mouseup", async function (e) {
    const datalistContainer = document.getElementById("edit_assigned_to_datalist");
    if (e.target.id === "edit_assigned_to_input") {
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

