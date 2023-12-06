let userData;
let user;
const imageStates = [
    { src: './assets/img/lock.png', alt: 'Schloss' }, // Bild 0 (Schloss)
    { src: 'assets/img/visibility.png', alt: 'Zeige Passwort' }, // Bild 1 (Auge)
    { src: 'assets/img/visibility_off.png', alt: 'Verberge Passwort' } // Bild 2 (Auge mit Strich)
];

function login(loginEmail, loginPassword) {
    user = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase()&& u.password === loginPassword);
    if (user) {
        userData = user;
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('selectedPage', '../../summary.html');
        currentUserWantsAutoLogin();
        removeLoginFailedClass();
        window.location.href = 'http://127.0.0.1:5500/summary.html';
    } else {
        console.warn('Login failed');
        addLoginFailedClass(); 
    }
}


function addLoginFailedClass() {
    const loginForm = document.getElementById('failed_pw');
    if (loginForm) {
        loginForm.classList.add('login_failed');
        let failedText = document.getElementById('password_failed');
        failedText.innerHTML = `Wrong password Ups! Try again.`;
    }
}


function removeLoginFailedClass() {
    const loginForm = document.getElementById('failed_pw');
    if (loginForm) {
        loginForm.classList.remove('login_failed');
        let failedText = document.getElementById('password_failed');
        failedText.innerHTML = '';
    }
}


function togglePasswordVisibility() {
    const passwordInput = document.getElementById('login_password');
    const passwordImage = document.getElementById('password_visibility_image');
    let currentState = 0;
    // Zu beginn das Bild mit dem Schloss zeigen
    passwordImage.src = imageStates[0].src;
    passwordImage.alt = imageStates[0].alt;
    passwordImage.addEventListener('click', () => {
        currentState = (currentState + 1) % (imageStates.length - 1);
        const { src, alt } = imageStates[currentState + 1];
        if (currentState === 1) {
            passwordInput.type = 'password'; // Passwort verbergen
        } else {
            passwordInput.type = 'text'; // Passwort anzeigen
        }
        passwordImage.src = src;
        passwordImage.alt = alt;
    });
}


document.addEventListener('DOMContentLoaded', function () {
    loginWhenEnterIsPressed();
});


function loginWhenEnterIsPressed() {
    if(isOnLoginPage()) {
        let loginEmail = document.getElementById('login_email');
        let loginPassword = document.getElementById('login_password');
        loginEmail.addEventListener('keyup', (event) => {
            if(event.keyCode === 13) {
                login(login_email.value, login_password.value);
            }
        });
        loginPassword.addEventListener('keyup', (event) => {
            if(event.keyCode === 13) {
                login(login_email.value, login_password.value);
            }
        });
    }
}


function autoLogin() {
    if(isOnLoginPage()) {
        const rememberMeStatusString = localStorage.getItem('checkbox');
        const rememberMeStatus = JSON.parse(rememberMeStatusString);
        if(currentUserExistInRemoteStorage() && isOnLoginPage() && rememberMeStatus) {
            const userDataString = localStorage.getItem('user');
            const userData = JSON.parse(userDataString);
            const userEmail = userData.email;
            const userPassword = userData.password;
            login(userEmail, userPassword);
        }
    }
}


function currentUserExistInRemoteStorage() {
    const localStorageUserData = localStorage.getItem('user');
    if(localStorageUserData) {
        const userData = JSON.parse(localStorageUserData);
        const userEmail = userData.email;
        const userPassword = userData.password;
        return users.find(u => u.email === userEmail && u.password === userPassword);
    }   
}


function currentUserWantsAutoLogin() {
    const rememberMeCheckBox = document.getElementById('remember_me');
    if(currentUserExistInRemoteStorage() && isOnLoginPage() && rememberMeCheckBox.checked) {
        localStorage.setItem('checkbox', 'true');
    } else {
        localStorage.setItem('checkbox', 'false');
    }
}


function isOnLoginPage() {
    return window.location.href === 'http://127.0.0.1:5500/' || window.location.pathname === '/index.html';
}


function isOnBoardPage() {
    return window.location.href === 'http://127.0.0.1:5500/' || window.location.pathname === '/board.html';
}


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
  