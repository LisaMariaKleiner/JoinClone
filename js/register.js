async function register() {
    registerBtn.disabled = true;
    if(signup_password.value !== signup_confirm_password.value) {
        console.warn('Passwords do not match');
        addPasswordsDontMatch();
    } else {
        users.push({
            name: signup_name.value,
            email: signup_email.value.toLowerCase(),
            password: signup_password.value,
            contacts: []
        });
        await setItem('users', JSON.stringify(users));
        resetForm();
        showLoginCard();
        showSuccessFeedback();
    }
}


function addPasswordsDontMatch() {
    const password1 = document.getElementById('pw1');
    const password2 = document.getElementById('pw2');
    if (password1, password2) {
        password1.classList.add('sign_up_failed');
        password2.classList.add('sign_up_failed');
        let failedText = document.getElementById('passwords_failed');
        failedText.innerHTML = `Wrong password Ups! Try again.`;
    }
}


function showSuccessFeedback() {
    slideCardUp()
    setTimeout(() => {
        slideCardDown()
    }, 1000);
}


function slideCardUp() {
    document.getElementById('success_feedback').classList.remove('slide_down')
    document.getElementById('success_feedback').style.display = 'flex';
    document.getElementById('success_feedback').classList.add('slide_up');
    document.getElementById('success_feedback').style.transform = 'translateY(0%)';
}


function slideCardDown() {
    document.getElementById('success_feedback').classList.remove('slide_up');
    document.getElementById('success_feedback').classList.add('slide_down');
    document.getElementById('success_feedback').style.transform = 'translateY(100%)';
    setTimeout(() => {
        document.getElementById('success_feedback').style.display = 'none';
    }, 500);
}


function resetForm() {
    signup_name.value = '';
    signup_email.value = '';
    signup_password.value = '';
    signup_confirm_password.value = '';
    registerBtn.disabled = false;
}


function showLoginCard() {
    document.getElementById('login_card').style.display = 'flex';
    document.getElementById('signup_card').style.display = 'none';
}


function togglePasswordVisibilitySignUp(inputId, imageId) {
    const passwordInput = document.getElementById(inputId);
    const passwordImage = document.getElementById(imageId);

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text'; // Passwort anzeigen
        passwordImage.src = 'assets/img/visibility.png'; // Zeige Passwort (Auge mit Strich)
        passwordImage.alt = 'Verberge Passwort';
    } else {
        passwordInput.type = 'password'; // Passwort verbergen
        passwordImage.src = './assets/img/visibility_off.png'; // Schloss
        passwordImage.alt = 'Schloss';
    }
}

