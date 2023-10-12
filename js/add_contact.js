let contacts = [];
let currentContactId;
let contactContainerLetters = 
['A','B','C','D','E','F','G','H','I','J','K',
'L','M','N','O','P','Q','R','S','T','U','V',
'W','X','Y','Z'];

async function loadContacts() {
    users = await getItem('users');
}

async function resetContacts() {
    let currentUserData = JSON.parse(localStorage.user);
    let currentUserContacts = currentUserData.contacts;
    currentUserContacts.splice(0, currentUserContacts.length);
    updateUserInRemoteStorage(currentUserData);
}

function renderContactLetterContainer() {
    contactContainerLetters.forEach(letter => {
        document.getElementById('show_contacts_container').innerHTML += createContactLetterContainer(letter);
    });
}

function createContactLetterContainer(letter) {
    return /*html*/ `
                    <div id="contact_container_${letter.toLowerCase()}" class="container_d_none">
                    <div id="" class="alphabet_container">
                        <span>${letter}</span>
                    </div>
                    <div class="horizontal_seperater"></div>
                    <div id="contact_container_letter_${letter.toLowerCase()}" >
                        
                    </div>
    `;
}

async function createNewContact() {
    const newContactName = new_contact_name.value;
    const newContactEmail = new_contact_email.value;
    const newContactPhone = new_contact_phone.value;
    currentContactId = contacts.length;

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
    setContacts();
}

async function setContacts() {
    currentUserEmail = JSON.parse(localStorage.getItem('user')).email;
    users = await getItem('users');
    users = JSON.parse(users);
    console.log(users);
    user = users.find(user => user.email === currentUserEmail);

    if(user) {
        contacts = user.contacts;
    }
    sortContacts(contacts);
}

function sortContacts(contacts) {
    contacts.forEach(contact => {
        contactName = contact.name;
        contactFirstName = contactName.split(' ')[0];
        contactLastName = contactName.split(' ')[1];
        contactPhone = contact.phone;
        contactId = contact.id;

        contactEmail = contact.email;

        contactFirstInitial = contactFirstName.charAt(0);
        contactSecondInitial = contact.name.split(' ')[1].charAt(0);
        contactInitial = contactFirstInitial + contactSecondInitial;
        showContactContainer(contactFirstInitial);
        renderContactCardIntoRightContainer(contactName, contactEmail, contactInitial, contactFirstInitial.toLowerCase(), contactPhone, contactId);
    })
}

function showContactContainer(contactFirstInitial) {
    contactContainer = document.getElementById(`contact_container_${contactFirstInitial.toLowerCase()}`);
    if(currentContactContainerHasDisplayNone(contactContainer)) {
        contactContainer.classList.remove('container_d_none');
        contactContainer.classList.add('container_d_flex');
    }
}

function currentContactContainerHasDisplayNone(contactContainer) {
    contactContainer = contactContainer;
    return contactContainer.classList.contains('container_d_none');
}

function renderContactCardIntoRightContainer(contactName, contactEmail, contactInitial, contactFirstInitial, contactPhone, contactId) {
    let contactCardContainer = document.getElementById(`contact_container_letter_${contactFirstInitial}`);
    contactCardContainer.innerHTML += createContactCard(contactInitial, contactName, contactEmail, contactPhone, contactId);
}

async function updateUserInRemoteStorage(updatedUserData) {
    const localStorageUserData = localStorage.getItem('user');
    if (localStorageUserData) {
        const userData = JSON.parse(localStorageUserData);
        const userEmail = userData.email;
        const userPassword = userData.password;

        const remoteUsersData = users;
        console.log('RemoteUsersData lädt er: ', remoteUsersData);
        // Find the user in the remote Storage and give the Index back
        const userIndex = remoteUsersData.findIndex(u => u.email === userEmail && u.password === userPassword);

        if (userIndex !== -1) {
            // Updates the data of the user
            remoteUsersData[userIndex] = { ...remoteUsersData[userIndex], ...updatedUserData };

            // User will be updated in the remote Storage
            const updatedUsersDataString = JSON.stringify(remoteUsersData);
            console.log('updatedUsersDataString lädt er: ', updatedUsersDataString);
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


function showContactInformation(contactInitial, contactName, contactEmail, contactPhone, contactId) {
    let contactInformationCard = document.getElementById('contact_information_card');
    contactInformationCard.innerHTML = createContactInformationCard(contactInitial, contactName, contactEmail, contactPhone, contactId);
    contactInformationCard.style.display = 'flex';
    contactInformationCard.classList.add('slide_in');
    contactInformationCard.style.transform = 'translate(0%)';
    document.getElementById('contact').setAttribute('onclick', `hideContactInformation(${contactInitial}, ${contactName}, ${contactEmail}, ${contactPhone}, ${contactId})`);
}

function createContactInformationCard(contactInitial, contactName, contactEmail, contactPhone, contactId) {
    return /*html*/ `
                    <div class="name_container">
                        <div class="name_icon">${contactInitial}</div>
                        <div>
                            <div class="name"><span>${contactName}</span></div>
                            <div class="edit_delete_container">
                                <div class="edit_container">
                                    <div class="icon_container">
                                        <img src="./assets/img/edit.svg" alt="edit">
                                    </div>
                                    <span>Edit</span>
                                </div>
                                <div class="delete_container">
                                    <div class="icon_container">
                                        <img src="./assets/img/delete.png" alt="edit">
                                    </div>
                                    <span>Delete</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="contact_information_title">
                        <span>Contact Information</span>
                    </div>
                    <div class="email_phone_container">
                        <div class="email_container">
                            <span>Email</span>
                            <a id="contact_email" href = "mailto: ${contactEmail}">${contactEmail}</a>
                        </div>
                        <div class="phone_container">
                            <span>Phone</span>
                            <a id="phone_number" href="tel:${contactPhone}">${contactPhone}</a>
                        </div>
                    </div>
            `;
}

function hideContactInformation(contactInitial, contactName, contactEmail, contactPhone, contactId) {
    let contactInformationCard = document.getElementById('contact_information_card');
    contactInformationCard.style.display = 'none';
    document.getElementById('contact').setAttribute('onclick', `showContactInformation(${contactInitial}, ${contactName}, ${contactEmail}, ${contactPhone}, ${contactId})`);
}

function createContactCard(contactInitial, contactName, contactEmail, contactPhone, contactId) {
    return /*html*/`
                    <div id="contact" class="contact" onclick="showContactInformation(${contactInitial}, ${contactName}, ${contactEmail}, ${contactPhone}, ${contactId})"> <!--Wird dann über JS generiert -->
                        <div class="task_member first_member">
                            <span>${contactInitial}</span>
                        </div>
                        <div class="member_shortinfo">
                            <span>${contactName}</span>
                            <span><a>${contactEmail}</a></span>
                        </div>
                    </div>
    `;
}