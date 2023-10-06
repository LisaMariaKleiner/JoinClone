


async function register() {
    registerBtn.disabled = true;
    if(signup_password.value !== signup_confirm_password.value) {
        console.warn('Passwords do not match');
    } else {
        users.push({
            name: signup_name.value,
            email: signup_email.value,
            password: signup_password.value,
            contacts: []
        });
        await setItem('users', JSON.stringify(users));
        resetForm();
        showSuccessFeedback();
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