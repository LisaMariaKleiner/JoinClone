let contacts = [];
let currentContactId = 0;


function renderContactCards() {
    
}


async function loadContacts() {
    users = await getItem('users');
}

async function resetContacts() {
    let currentUserData = JSON.parse(localStorage.user);
    let currentUserContacts = currentUserData.contacts;
    currentUserContacts.splice(0, currentUserContacts.length);
    updateUserInRemoteStorage(currentUserData);
}

async function createNewContact() {
    const newContactName = new_contact_name.value;
    const newContactEmail = new_contact_email.value;
    const newContactPhone = new_contact_phone.value;

    const newContact = {
        id: currentContactId,
        name: newContactName,
        email: newContactEmail,
        phone: newContactPhone
    };

    let currentUserData = JSON.parse(localStorage.user);
    let currentUserContacts = currentUserData.contacts;
    currentUserContacts.push(newContact);
    localStorage.setItem('user', JSON.stringify(currentUserData));
    clearNewContactForm();
    updateUserInRemoteStorage(currentUserData);
    currentContactId++;
}

async function updateUserInRemoteStorage(updatedUserData) {
    const localStorageUserData = localStorage.getItem('user');
    if (localStorageUserData) {
        const userData = JSON.parse(localStorageUserData);
        const userEmail = userData.email;
        const userPassword = userData.password;

        const remoteUsersData = JSON.parse(users);

        // Find the user in the remote Storage and give the Index back
        const userIndex = remoteUsersData.findIndex(u => u.email === userEmail && u.password === userPassword);

        if (userIndex !== -1) {
            // Updates the data of the user
            remoteUsersData[userIndex] = { ...remoteUsersData[userIndex], ...updatedUserData };

            // User will be updated in the remote Storage
            const updatedUsersDataString = JSON.stringify(remoteUsersData);
            await setItem('users', updatedUsersDataString);
        } else {
            console.warn('User could not be found in the remote Storage.');
        }
    } else {
        console.warn('User could not be found in the remote Storage.');
    }
}

function clearNewContactForm() {
    new_contact_name.value = '';
    new_contact_email.value = '';
    new_contact_phone.value = '';
}


function showContactInformation() {
    let contactInformationCard = document.getElementById('contact_information_card');
    contactInformationCard.style.display = 'flex';
    contactInformationCard.classList.add('slide_in');
    contactInformationCard.style.transform = 'translate(0%)';
    document.getElementById('contact').setAttribute('onclick', 'hideContactInformation()');
}

function hideContactInformation() {
    let contactInformationCard = document.getElementById('contact_information_card');
    contactInformationCard.style.display = 'none';
    document.getElementById('contact').setAttribute('onclick', 'showContactInformation()');
}