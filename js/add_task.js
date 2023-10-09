let tasks = [];

let currentId = 0;
let currentDraggedElement;

async function createNewTask() {
    let title = document.getElementById('title_input').value;
    let description = document.getElementById('description_textarea').value;
    let assignedTo = document.getElementById('assigned_to_input').value;
    let date = document.getElementById('date_input').value;
    let taskCategory = document.getElementById('task_category_input').value;
    let subtaskCategory = document.getElementById('subtask_category_input').value;

    tasks.push({
        id: currentId,
        title: title,
        description: description,
        assignedTo: assignedTo,
        date: date,
        taskCategory: taskCategory,
        subtaskCategory: subtaskCategory,
        category: 'toDo',
    });

    await setItem('tasks', JSON.stringify(tasks));
    updateHTML();
    currentId++;
}

function updateHTML() {
    updateCard('toDo', 'to_do');
    updateCard('inProgress', 'in_progress');
    updateCard('awaitFeedback', 'await_feedback');
    updateCard('done', 'done');
}

function updateCard(category, containerId) {
    category = tasks.filter(t => t['category'] == category);

    document.getElementById(containerId).innerHTML = '';

    for (let index = 0; index < category.length; index++) {
        const element = category[index];
        document.getElementById(containerId).innerHTML += createTask(element);
    }
}


function createTask (element) {
    return /*html*/`
        <div class="task_card" draggable="true" ondragstart="StartDragging(${element['id']})>
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

function startDragging(id) {
    currentDraggedElement = id; // id = 0
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(category) {
    tasks[currentDraggedElement]['category'] = category; // tasks[0]['category']
    updateHTML();
}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}