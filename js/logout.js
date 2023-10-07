let logOutBox = document.getElementById('log_out_box');
let userProfileButton = document.getElementById('user_profile_button');

function changeLogOutBoxState(action) {
    if(action === 'open') {
        document.getElementById('log_out_box').style.display = 'flex';
        document.getElementById('user_profile_button').setAttribute('onclick', `changeLogOutBoxState('close')`);
    } else if (action === 'close') {
        document.getElementById('log_out_box').style.display = 'none';
        document.getElementById('user_profile_button').setAttribute('onclick', `changeLogOutBoxState('open')`);
    }
}

document.addEventListener('mouseup', function(e) {
    let logOutBox = document.getElementById('log_out_box');
    if (!logOutBox.contains(e.target)) {
        logOutBox.style.display = 'none';
        document.getElementById('user_profile_button').setAttribute('onclick', `changeLogOutBoxState('open')`);
    }
});

function logOut() {
    localStorage.removeItem('user');
    window.location.href = 'http://127.0.0.1:5500/';
}

