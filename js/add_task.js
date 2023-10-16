let tasks = [];

let currentDraggedElement;

async function loadTasks() {
    let loadedTasks = JSON.parse(await getItem('tasks'));
    tasks = loadedTasks;
}

async function createNewTask() {
    let title = document.getElementById('title_input').value;
    let description = document.getElementById('description_textarea').value;
    let assignedTo = document.getElementById('assigned_to_input').value;
    let date = document.getElementById('date_input').value;
    let taskCategory = document.getElementById('task_category_input').value;
    let subtaskCategory = document.getElementById('subtask_category_input').value;

    tasks.push({
        id: tasks.length,
        title: title,
        description: description,
        assignedTo: assignedTo,
        date: date,
        taskCategory: taskCategory,
        subtaskCategory: subtaskCategory,
        category: 'toDo',
    });

    await setItem('tasks', JSON.stringify(tasks));
    clearInputFields();
    if (window.location.pathname == '/board.html') {
        await updateHTML();
    }
    await updateTasksInRemoteStorage(tasks)
    moveAddTaskCard('close');
};

function clearInputFields() {
    document.getElementById('title_input').value = '';
    document.getElementById('description_textarea').value = '';
    document.getElementById('assigned_to_input').value = '';
    document.getElementById('date_input').value = '';
    document.getElementById('task_category_input').value = '';
    document.getElementById('subtask_category_input').value = '';
}

async function updateHTML() {
    await loadTasks();
    if(isOnBoardPage()) {
        await updateCard('toDo', 'to_do');
        await updateCard('inProgress', 'in_progress');
        await updateCard('awaitFeedback', 'await_feedback');
        await updateCard('done', 'done');
    }
    await updateTaskCounts();
};

async function updateCard(category, containerId) {
    category = tasks.filter(t => t['category'] == category);

    document.getElementById(containerId).innerHTML = '';

    for (let index = 0; index < category.length; index++) {
        const element = category[index];
        document.getElementById(containerId).innerHTML += createTask(element);
    }
};

function startDragging(id) {
    currentDraggedElement = id; // id = 0
    console.log('CurrentDraggedElement is: ' + currentDraggedElement);
}

function createTask (element) {
    return /*html*/`
        <div class="task_card" draggable="true" ondragstart="startDragging(${element['id']})" onclick="openTaskDetailsCard(${element['id']}, 'open')">
            <h3 class="user_story">User Story</h3>
            <div class="task_information">
                <h2>${element['title']}</h2>
                <p>${element['description']}</p>
            </div>
            <div class="subtask_progress_container">
                <div class="subtask_progressbar">
                    <div class="current_subtask_progress"></div>
                </div>
                <span>${element['subtaskCategory']}</span>
            </div>
            <div class="task_footer">
                <div class="task_member_container">
                    <div class="task_member first_member">
                        <span>AM</span>
                    </div>
                    <div class="task_member second_member">
                        <span>EM</span>
                    </div>
                </div>
                <div class="task_urgency_information">

                </div>
            </div>
        </div>
`;}

function allowDrop(ev) {
    ev.preventDefault();
}

async function moveTo(category, containerId) {
    tasks[currentDraggedElement]['category'] = category; // tasks[0]['category']
    await updateTasksInRemoteStorage(tasks);
    await updateHTML();
    removeHighlight(containerId);
}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}

async function updateTasksInRemoteStorage(updatedTasks) {
        const updatedTasksAsString = JSON.stringify(updatedTasks);
        await setItem('tasks', updatedTasksAsString);
}

function slideCardUp() {
    document.getElementById('success_feedback').classList.remove('slide_down_without_bg')
    document.getElementById('success_feedback').style.display = 'flex';
    document.getElementById('success_feedback').classList.add('slide_up_without_bg');
    document.getElementById('success_feedback').style.transform = 'translateY(0%)';
}

function slideCardDown() {
    document.getElementById('success_feedback').classList.remove('slide_up_without_bg');
    document.getElementById('success_feedback').classList.add('slide_down_without_bg');
    document.getElementById('success_feedback').style.transform = 'translateY(100%)';
    setTimeout(() => {
        document.getElementById('success_feedback').style.display = 'none';
    }, 500);
    setTimeout(() => {
        window.location.pathname = '/board.html';
    }, 1000);
}

function openTaskDetailsCard(cardId, action) {
    showTaskDetailsCard(action)
    renderTaskDetails(cardId);

}

function showTaskDetailsCard(action) {
    let taskDetailsBackground = document.getElementById('task_card_opened');
    let taskDetailsCard = document.getElementById('current_task_card');
    if(action === 'open') {
        openDetailsCard(taskDetailsBackground, taskDetailsCard);
    } else if (action === 'close') {
        closeDetailsCard(taskDetailsBackground, taskDetailsCard)
    }
}

function openDetailsCard(taskDetailsBackground, taskDetailsCard) {
    taskDetailsBackground.style.display = 'flex';
    taskDetailsBackground.classList.add('background_fade_in')
    taskDetailsCard.classList.add('slide_in_no_bg_change')
    taskDetailsCard.style.transform = 'translate(0%)';
    setTimeout(() => {
        taskDetailsCard.classList.remove('slide_in_no_bg_change')
        taskDetailsBackground.classList.remove('background_fade_in')
    }, 500);
}

function closeDetailsCard(taskDetailsBackground, taskDetailsCard) {
    taskDetailsCard.classList.add('slide_out_no_bg_change')
    taskDetailsBackground.classList.add('background_fade_in')
    taskDetailsCard.style.transform = 'translate(200%)';
    setTimeout(() => {
        taskDetailsCard.classList.remove('slide_out_no_bg_change')
        taskDetailsBackground.classList.remove('background_fade_in')
        taskDetailsBackground.style.display = 'none';
    }, 500);
}

function renderTaskDetails(cardId) {
    let currentTask = tasks[cardId];
    renderTaskTitle(currentTask);
    renderTaskDescription(currentTask);
    renderTaskDate(currentTask);
    renderTaskPriority(currentTask);
}

function renderTaskTitle(currentTask) {
    let taskTitle = document.getElementById('task_title');
    taskTitle.innerText = currentTask.title;
}

function renderTaskDescription(currentTask) {
    let taskDescription = document.getElementById('task_description');
    taskDescription.innerText = currentTask.title;
}

function renderTaskDate(currentTask) {
    let taskDate = document.getElementById('task_date');
    taskDate.innerText = currentTask.title;
}

function renderTaskPriority(currentTask) {
    let taskPriority = document.getElementById('task_priority');
    taskPriority.innerText = currentTask.title;
}

document.addEventListener('mouseup', function(e) {
    let taskDetailsCard = document.getElementById('current_task_card')
    if(isTaskDetailsCardOpen()) {
        if (!taskDetailsCard.contains(e.target)) {
            showTaskDetailsCard('close')
        }
    }
});

function isTaskDetailsCardOpen() {
    if(isOnBoardPage()) {
        return document.getElementById('task_card_opened').style.display != 'none';
    }
}



// Funktion, um die Anzahl der Tasks in einer bestimmten Kategorie zu zählen
function countTasksInCategory(category) {
    return tasks.filter(task => task.category === category).length;
}

function countTasksInProgress() {
    return countTasksInCategory('inProgress');
}

function countTasksInFeedback() {
    return countTasksInCategory('awaitFeedback');
}

function countTasksToDo() {
    return countTasksInCategory('toDo');
}

function countCompletedTasks() {
    return countTasksInCategory('done');
}

// Funktion zum Aktualisieren der Anzeige der Task-Zahlen in den HTML-Elementen
async function updateTaskCounts() {
    if(isOnSummaryPage()) {
    let tasksCountElement = document.getElementById('tasks_count');
    let progressCountElement = document.getElementById('progress_count');
    let feedbackCountElement = document.getElementById('feedback_count');
    let todoCountElement = document.getElementById('todo_count');
    let doneCountElement = document.getElementById('done_count');

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


document.addEventListener('DOMContentLoaded', async function() {
    if(isOnSummaryPage()) {
        await updateHTML();
    }
});
