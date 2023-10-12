let userData;
let user;

function login(loginEmail, loginPassword) {
    user = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase()&& u.password === loginPassword);
    if (user) {
        userData = user;
        localStorage.setItem('user', JSON.stringify(userData));
        currentUserWantsAutoLogin();
        window.location.href = 'http://127.0.0.1:5500/summary.html';
    } else {
        console.warn('Login failed');
    }
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

function isOnSummaryPage() {
    return window.location.href === 'http://127.0.0.1:5500' || window.location.pathname === '/summary.html';
}

function isOnBoardPage() {
    return window.location.href === 'http://127.0.0.1:5500' || window.location.pathname === '/board.html';
}

function loadUserInSummary() {
    if(isOnSummaryPage()) {
        const userDataString = localStorage.getItem('user');

        if (userDataString) {
            
            const userData = JSON.parse(userDataString);
    
            if (userData.name) {  
                document.getElementById('username').textContent = userData.name;
                document.getElementById('greeting').textContent = 'Good morning,';
            } else {
                document.getElementById('username').textContent = '';
            }
        } else {
            document.getElementById('username').textContent = '';
        }
    }
}