function login() {
    let user = users.find(u => u.email === login_email.value && u.password === login_password.value);
    if (user) {
        console.log(user);
        window.location.href = 'http://127.0.0.1:5500/summary.html';
    } else {
        console.warn('Login failed');
    }
}