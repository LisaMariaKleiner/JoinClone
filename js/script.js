function init() {
    includeHTML();
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