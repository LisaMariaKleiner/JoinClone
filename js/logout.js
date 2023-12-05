

document.addEventListener('DOMContentLoaded', function() {
    let logOutBox = document.getElementById('log_out_box');
    let userProfileButton = document.getElementById('user_profile_button');

    if (!logOutBox || !userProfileButton) {
        console.error("Element 'log_out_box' or 'user_profile_button' not found.");
        return;
    }

    function changeLogOutBoxState(action) {
        if (action === 'open') {
            logOutBox.style.display = 'flex';
            userProfileButton.setAttribute('onclick', `changeLogOutBoxState('close')`);
        } else if (action === 'close') {
            logOutBox.style.display = 'none';
            userProfileButton.setAttribute('onclick', `changeLogOutBoxState('open')`);
        }
    }

    document.addEventListener('mouseup', function(e) {
        if (logOutBox && !logOutBox.contains(e.target)) {
            logOutBox.style.display = 'none';
            userProfileButton.setAttribute('onclick', `changeLogOutBoxState('open')`);
        }
    });

    function logOut() {
        localStorage.removeItem('user');
        localStorage.removeItem('checkbox');
        window.location.href = 'http://127.0.0.1:5500/';
    }
});



/*let logOutBox = document.getElementById('log_out_box');
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
    localStorage.removeItem('checkbox');
    window.location.href = 'http://127.0.0.1:5500/';
}
*/
