// Überprüfe den ausgewählten Zustand beim Laden der Seite
const selectedPage = localStorage.getItem('selectedPage');
if (selectedPage) {
    const menuItems = document.querySelectorAll('.menu_element_container');
    menuItems.forEach(item => {
        if (item.getAttribute('data-href') === selectedPage) {
            item.classList.add('selected');
        }
    });
}



async function init() {
    includeHTML();
    await loadUsers();
    autoLogin();
    loadUserInSummary();
    checkForSelectedPage('../../summary.html', 'summary_link');
    checkForSelectedPage('../../add_task.html', 'add_task_link');
    checkForSelectedPage('../../board.html', 'board_link');
    checkForSelectedPage('../../contacts.html', 'contacts_link');
    checkForSelectedPage('../../PrivacyPolicy.html', 'privacy_policy_link');
    checkForSelectedPage('../../legal_notice.html', 'legal_notice_link');
    await updateTaskCounts();
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

function setIndexCard(event) {
    let loginCard = document.getElementById('login_card');
    let signupCard = document.getElementById('signup_card');
    let headerSignUpButton = document.getElementById('header_signup_button');
    let goBackToLoginCardButton = document.getElementById('go_back_to_login_card');

    if (event === 'login') {
        loginCard.style.display = 'flex';
        signupCard.style.display = 'none';
        headerSignUpButton.style.display = 'flex';
        goBackToLoginCardButton.style.display = 'none';
    } else if (event === 'signup') {
        loginCard.style.display = 'none';
        signupCard.style.display = 'flex';
        headerSignUpButton.style.display = 'none';
        goBackToLoginCardButton.style.display = 'flex';
    }
}

function moveAddTaskCard(event) {
    let taskCard = document.getElementById('add_task_card');
    if (event === 'open') {
        slideCardIn(taskCard);
    } else if (event === 'close') {
        slideCardOut(taskCard);
    }
}

function slideCardIn(container) {
    container.classList.remove('slide_out')
    container.style.display = 'flex';
    container.classList.add('slide_in');
    container.style.transform = 'translateX(0%)';
}

function slideCardOut(container) {
    container.classList.remove('slide_in');
    container.classList.add('slide_out');
    container.style.transform = 'translateX(150%)';
    setTimeout(() => {
        container.style.display = 'none';
    }, 500);
}

function navigateToPage(container, page) {
    const href = container.getAttribute('data-href');
    if (href) {
        // Setze den ausgewählten Zustand im Local Storage
        localStorage.setItem('selectedPage', page);
        window.location.href = href;
    }
}

function checkForSelectedPage(hrefLink, containerId) {
    const selectedPage = localStorage.getItem('selectedPage');
    if (selectedPage === hrefLink) {
        document.getElementById(containerId).classList.add('selected');
    }
}