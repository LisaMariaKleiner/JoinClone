function loadUserInSummary() {
    if(isOnSummaryPage()) {
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            if (userData.name) {  
                document.getElementById('username').textContent = userData.name;
            } else {
                document.getElementById('username').textContent = '';
            }
        } else {
            document.getElementById('username').textContent = '';
        }
    }
}


function greetUser() { 
    if (isOnSummaryPage()) {
        const storedUser = localStorage.getItem('user');
        const greeting = getGreeting();

        if (storedUser) {
            document.getElementById('greeting').innerHTML = greeting;
            loadUserInSummary();
        } else {
            document.getElementById('greeting').innerHTML = greeting;
        }
    } 
}

function getGreeting() {
    const now = new Date();
    const currentHour = now.getHours();
    let greeting = '';
  
    if (currentHour >= 5 && currentHour < 12) {
      greeting = 'Good Morning,';
    } else if (currentHour >= 12 && currentHour < 17) {
      greeting = 'Good Afternoon,';
    } else {
      greeting = 'Good Evening,';
    }
  
    return greeting;
  }

function isOnSummaryPage() {
    return window.location.href === 'http://127.0.0.1:5500/' || window.location.pathname === '/summary.html';
}

// Funktion zum Aktualisieren der Anzeige der Task-Zahlen in den HTML-Elementen
function updateTaskCounts() {
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
  