let userData;

function login() {
    let user = users.find(u => u.email === login_email.value && u.password === login_password.value);
    if (user) {
        userData = user;
        localStorage.setItem('user', JSON.stringify(userData));
        window.location.href = 'http://127.0.0.1:5500/summary.html';
    } else {
        console.warn('Login failed');
    }
}

function loadUserInSummery() {
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