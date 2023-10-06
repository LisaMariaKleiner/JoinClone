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