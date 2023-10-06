
let contacts = [];

function createNewContact() {
    const newContactName = new_contact_name.value;
    const newContactEmail = new_contact_email.value;
    const newContactPhone = new_contact_phone.value;

    const newContact = {
        name: newContactName,
        email: newContactEmail,
        phone: newContactPhone
    };

    contacts.push(newContact);
    clearNewContactForm();
    localStorage.user.setObj('contacts', JSON.stringify(contacts));
}

function clearNewContactForm() {
    new_contact_name.value = '';
    new_contact_email.value = '';
    new_contact_phone.value = '';
}

function updateUserInRemoteStorage(user) {
    user.contacts.push(contacts);
}

function checkForUserInRemoteStorage() {
    const userDataString = localStorage.getItem('user');
    const userEmail = JSON.parse(userDataString).email;
    const userPhone = JSON.parse(userDataString).password;
    if(users.find(u => u.email === userEmail && u.password === userPhone)) {
        updateUserInRemoteStorage(u);
    }
}