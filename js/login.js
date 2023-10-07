let userData;
let user;

function login() {
    user = users.find(u => u.email === login_email.value && u.password === login_password.value);
    if (user) {
        userData = user;
        localStorage.setItem('user', JSON.stringify(userData));
        window.location.href = 'http://127.0.0.1:5500/summary.html';
    } else {
        console.warn('Login failed');
    }
}

function autoLogin() {
    if(currentUserExistInRemoteStorage() && isOnLoginPage()) {
        window.location.href = 'http://127.0.0.1:5500/summary.html';
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

function isOnLoginPage() {
    return window.location.href === 'http://127.0.0.1:5500/' || window.location.pathname === '/index.html';
}

function loadUserInSummary() {
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