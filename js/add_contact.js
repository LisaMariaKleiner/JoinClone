
let contacts = [];

async function createNewContact() {
    const newContactName = new_contact_name.value;
    const newContactEmail = new_contact_email.value;
    const newContactPhone = new_contact_phone.value;

    const newContact = {
        name: newContactName,
        email: newContactEmail,
        phone: newContactPhone
    };

    const currentUserData = JSON.parse(localStorage.user);
    const currentUserContacts = currentUserData.contacts;
    currentUserContacts.push(newContact);
    localStorage.setItem('user', JSON.stringify(currentUserData));
    clearNewContactForm();
    await updateUserInRemoteStorage(currentUserData);
}

async function updateUserInRemoteStorage(updatedUserData) {
    const localStorageUserData = localStorage.getItem('user');
    if (localStorageUserData) {
        const userData = JSON.parse(localStorageUserData);
        const userEmail = userData.email;
        const userPassword = userData.password;

        const remoteUsersDataString = await getItem('users');
        const remoteUsersData = JSON.parse(remoteUsersDataString);

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