let contacts = [];
let currentContactId;
let contactContainerLetters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
let lastOpenedContact;

async function loadContacts() {
  let users = await getItem("users");
}

async function resetContacts() {
  let currentUserData = JSON.parse(localStorage.user);
  let currentUserContacts = currentUserData.contacts;
  currentUserContacts.splice(0, currentUserContacts.length);
  await updateUserInRemoteStorage(currentUserData);
}

async function setContacts() {
  currentUserEmail = JSON.parse(localStorage.getItem("user")).email;
  users = await getItem("users");
  users = JSON.parse(users);
  user = users.find((user) => user.email === currentUserEmail);
  if (user) {
    contacts = user.contacts;
  } else {
    contacts = []; // Wenn kein Nutzer gefunden wurde, setze die Variable auf ein leeres Array
  }
  sortContacts(contacts);
}


function renderContactLetterContainer() {
  contactContainerLetters.forEach((letter) => {
    document.getElementById("show_contacts_container").innerHTML +=
      createContactLetterContainer(letter);
  });
}


function findFreeId() {
  for (let index = 0; index < 100; index++) {
    if ((contacts.findIndex(k => k['id'] === index) == -1)){
      return index;
    }
  }
}


async function createNewContact() {
  resetContactCards();
  const newContactName = new_contact_name.value;
  const newContactEmail = new_contact_email.value;
  const newContactPhone = new_contact_phone.value;
  currentContactId = findFreeId();
  const newContact = {
    id: currentContactId,
    name: newContactName,
    email: newContactEmail,
    phone: newContactPhone,
  };
  contacts.push(newContact);
  user = JSON.parse(localStorage.getItem('user'));
  user.contacts = contacts;
  user = JSON.stringify(user);
  clearNewContactForm();
  await updateUserInRemoteStorage(user.contacts);
  showContactSuccessMessage("open");
  renderContactLetterContainer();
  await setContacts();
}

function clearNewContactForm() {
  new_contact_name.value = "";
  new_contact_email.value = "";
  new_contact_phone.value = "";
}


async function updateUserInRemoteStorage(updatedUserData) {
  const localStorageUserData = localStorage.getItem("user");
  if (localStorageUserData) {
    const userData = JSON.parse(localStorageUserData);
    const userEmail = userData.email;
    const userPassword = userData.password;

    const remoteUsersData = users;
    const userIndex = remoteUsersData.findIndex(
      (u) => u.email === userEmail && u.password === userPassword
    );
    if (userIndex !== -1) {
      remoteUsersData[userIndex] = {
        ...remoteUsersData[userIndex],
        ...updatedUserData,
      };
      let updatedUsersDataString = JSON.stringify(remoteUsersData);
      await setItem("users", updatedUsersDataString);
    } else {
      console.warn("User could not be found in the remote Storage.");
    }
  } else {
    console.warn("User could not be found in the remote Storage.");
  }
}


function showContactSuccessMessage(action) {
  let successMessageBackground = document.getElementById(
    "contact_success_message_container"
  );
  let successMessageCard = document.getElementById(
    "contact_success_message_card"
  );
  if (action === "open") {
    openContactSuccessMessage(successMessageBackground, successMessageCard);
  } else if (action === "close") {
    closeContactSuccessMessage(successMessageBackground, successMessageCard);
  }
}


function openContactSuccessMessage(
  successMessageBackground,
  successMessageCard
) {
  successMessageBackground.style.display = "flex";
  successMessageBackground.classList.add("background_fade_in");
  successMessageCard.classList.add("slide_up_without_bg");
  setTimeout(() => {
    successMessageBackground.classList.remove("background_fade_in");
    successMessageCard.classList.remove("slide_up_without_bg");
    setTimeout(() => {
      showContactSuccessMessage("close");
    }, 1000);
  }, 500);
}


function closeContactSuccessMessage(
  successMessageBackground,
  successMessageCard
) {
  successMessageBackground.classList.add("background_fade_out");
  successMessageCard.classList.add("slide_down_without_bg");
  setTimeout(() => {
    successMessageBackground.classList.remove("background_fade_out");
    successMessageCard.classList.remove("slide_down_without_bg");
    successMessageBackground.style.display = "none";
  }, 500);
}


function sortContacts(contacts) {
  contacts.forEach((contact) => {
     if (contact.name) {
       contactName = contact.name;
       const nameParts = contactName.split(" ");
       contactFirstName = nameParts[0];
       contactLastName = nameParts[1] || ''; // Wenn kein Nachname vorhanden ist, leere Zeichenkette verwenden
       contactPhone = contact.phone;
       contactId = contact.id;
       contactEmail = contact.email;
       contactFirstInitial = contactFirstName.charAt(0);
       contactSecondInitial = contactLastName.charAt(0);
       contactInitial = contactFirstInitial + contactSecondInitial;
       showContactContainer(contactFirstInitial);
       renderContactCardIntoRightContainer(
         contactName,
         contactEmail,
         contactInitial,
         contactFirstInitial.toLowerCase(),
         contactPhone,
         contactId
       );
       contactId = '';
     } else {
       console.log('Name kann nicht angezeigt werden');
     }
  });
}


function showContactContainer(contactFirstInitial) {
  contactContainer = document.getElementById(
    `contact_container_${contactFirstInitial.toLowerCase()}`
  );
  if (currentContactContainerHasDisplayNone(contactContainer)) {
    contactContainer.classList.remove("container_d_none");
    contactContainer.classList.add("container_d_flex");
  }
}


function renderContactCardIntoRightContainer(
  contactName,
  contactEmail,
  contactInitial,
  contactFirstInitial,
  contactPhone,
  contactId
) {
  let contactCardContainer = document.getElementById(
    `contact_container_letter_${contactFirstInitial}`
  );
  contactCardContainer.innerHTML += createContactCard(
    contactInitial,
    contactName,
    contactEmail,
    contactPhone,
    contactId
  );
}


function resetContactCards() {
      contactContainerLetters.forEach((letter) => {
        const contactContainerLetter = letter.toLowerCase();
        document.getElementById(`contact_container_letter_${contactContainerLetter}`).innerHTML = '';
      })
}


function currentContactContainerHasDisplayNone(contactContainer) {
  contactContainer = contactContainer;
  return contactContainer.classList.contains("container_d_none");
}


function showContactInformation(
  contactInitial,
  contactName,
  contactEmail,
  contactPhone,
  contactId
) {
  if (lastOpenedContact === contactId) {
    hideContactInformation();
    changeSelectedState(lastOpenedContact, "unselected");
    lastOpenedContact = "";
  } else {
    hideContactInformation();
    setTimeout(() => {
      let contactInformationCard = document.getElementById(
        "contact_information_card"
      );
      createContactInformationCard(
        contactInitial,
        contactName,
        contactEmail,
        contactPhone,
        contactId
      );
      setEditButtonOnClick(
        contactInitial,
        contactName,
        contactEmail,
        contactPhone,
        contactId
      );
      setDeleteButtonOnClick(
        contactInitial,
        contactName,
        contactEmail,
        contactPhone,
        contactId
      );
      addOpenedContactAnimation(contactInformationCard);
      changeSelectedState(contactId, "selected");
      if (lastOpenedContact) {
        changeSelectedState(lastOpenedContact, "unselected");
      }
      lastOpenedContact = contactId;
    }, 200);
  }
}


function setEditButtonOnClick(
  contactInitial,
  contactName,
  contactEmail,
  contactPhone,
  contactId
) {
  document
    .getElementById("edit_button")
    .setAttribute(
      "onclick",
      `moveEditContactCard('${contactInitial}', '${contactName}', '${contactEmail}', '${contactPhone}', '${contactId}','open')`
    );
}


function setDeleteButtonOnClick(
  contactInitial,
  contactName,
  contactEmail,
  contactPhone,
  contactId
) {
  document
    .getElementById("delete_button")
    .setAttribute(
      "onclick",
      `deleteContact('${contactId}')`
    );
}

function addOpenedContactAnimation(contactInformationCard) {
  contactInformationCard.style.display = "flex";
  contactInformationCard.classList.add("slide_in_no_bg_change");
  contactInformationCard.style.transform = "translate(0%)";
}


function changeSelectedState(contactId, action) {
  if (action === "selected") {
    document.getElementById(`contact_${contactId}`).classList.add("selected");
    document
      .getElementById(`contact_card_name_${contactId}`)
      .classList.add("color_white");
  } else if (action === "unselected" && containerHasClassSelected(contactId)) {
    document
      .getElementById(`contact_${contactId}`)
      .classList.remove("selected");
    document
      .getElementById(`contact_card_name_${contactId}`)
      .classList.remove("color_white");
  }
}


function containerHasClassSelected(contactId) {
  return document
    .getElementById(`contact_${contactId}`)
    .classList.contains("selected");
}


function createContactInformationCard(
  contactInitial,
  contactName,
  contactEmail,
  contactPhone,
  contactId
) {
  document.getElementById("contact_initials").innerText = contactInitial;
  document.getElementById("contact_name").innerText = contactName;
  document.getElementById("contact_email").innerText = contactEmail;
  document.getElementById("phone_number").innerText = contactPhone;
}

function hideContactInformation() {
  let contactInformationCard = document.getElementById(
    "contact_information_card"
  );
  contactInformationCard.style.display = "none";
}


function moveAddNewContactCard(event) {
  let addNewContactBackground = document.getElementById("card_background");
  let addNewContactCard = document.getElementById("add_new_contact_card");
  if (event === "open") {
    addNewContactBackground.style.display = "flex";
    addNewContactBackground.classList.add("background_fade_in");
    slideCardIn(addNewContactCard);
    setTimeout(() => {
      addNewContactBackground.classList.remove("background_fade_in");
    }, 500);
  } else if (event === "close") {
    addNewContactBackground.classList.add("background_fade_out");
    slideCardOut(addNewContactCard);
    setTimeout(() => {
      addNewContactBackground.classList.remove("background_fade_out");
      addNewContactBackground.style.display = "none";
    }, 500);
  }
}


function moveEditContactCard(
  contactInitial,
  contactName,
  contactEmail,
  contactPhone,
  contactId,
  event
) {
  let editCard = document.getElementById("edit_card_background");
  if (event === "open") {
    document.getElementById("edit_card_background").innerHTML = createEditCard(
      contactName,
      contactEmail,
      contactPhone,
      contactId,
      contactInitial
    );
    slideCardIn(editCard);
    fillContactInformation(contactId, contactInitial);
  } else if (event === "close") {
    slideCardOut(editCard);
  }
}


function fillContactInformation(contactId, contactInitial) {
  let contactName = contacts[getContactIdIndex(contactId)].name;
  let contactEmail = contacts[getContactIdIndex(contactId)].email;
  let contactPhone = contacts[getContactIdIndex(contactId)].phone;
  document.getElementById("edit_contact_initials").innerText = contactInitial;
  document.getElementById("edit_contact_name").value = contactName;
  document.getElementById("edit_contact_email").value = contactEmail;
  document.getElementById("edit_contact_phone").value = contactPhone;
}


async function saveContact(contactId) {
    const editedContactName = edit_contact_name.value;
    const editedContactEmail = edit_contact_email.value;
    const editedContactPhone = edit_contact_phone.value;
    let currentContact = contacts[getContactIdIndex(contactId)];
    currentContact.name = editedContactName;
    currentContact.email = editedContactEmail;
    currentContact.phone = editedContactPhone;
    currentUser = JSON.parse(localStorage.getItem("user"));
    currentUser.contacts = contacts;
    await updateUserInRemoteStorage(currentUser);
    const updatedUsersData = await getItem("users");
    if (updatedUsersData) {
      users = JSON.parse(updatedUsersData);
      users = users;
    }
    renderContactInformation(contactId, contactInitial);
    return users;
  }


function getContactIdIndex(contactId){
  let currentIndex;
    for (let i = 0; i < contacts.length; i++) {
    if (Number(contactId) === contacts[i].id) {
      return currentIndex = i;
    }
  }
}


async function deleteContact(contactId) {
  const remoteUserData = await getItem("users");
  if (remoteUserData) {
    const remoteUsersData = JSON.parse(remoteUserData);
    const currentUserEmail = JSON.parse(localStorage.getItem("user")).email;
    const currentUser = remoteUsersData.find((user) => user.email === currentUserEmail);
    if (currentUser) {
      const currentUserContacts = currentUser.contacts;
      if (getContactIdIndex(contactId) > -1) {
        currentUserContacts.splice(getContactIdIndex(contactId), 1);
        currentUser.contacts = currentUserContacts;
        const updatedUsersDataString = JSON.stringify(remoteUsersData);
        await setItem("users", updatedUsersDataString);
        location.reload();
      } else {
        console.warn("Ungültiger Kontaktindex.");
      }
    } else {
      console.warn("Benutzer nicht gefunden im Remote Storage.");
    }
  } else {
    console.warn("Fehler beim Abrufen der Benutzerdaten aus dem Remote Storage.");
  }
}


function resetContactInformations(contactInitial, 
    contactName, 
    contactEmail, 
    contactPhone
    ) {

    document.getElementById('contact_initials').innerText = contactInitial;
    document.getElementById('contact_name').innerText = contactName;
    document.getElementById('contact_email').innerText = contactEmail;
    document.getElementById('phone_number').innerText = contactPhone;
}


async function renderContactInformation(contactId, contactInitial) {
    users = await getItem('users');
    users = JSON.parse(users);
    currentUser = JSON.parse(localStorage.getItem('user'));
    currentUserEmail = currentUser.email;
    user = users.find(user => user.email === currentUserEmail);
    let userContacts = user.contacts;
    let currentContact = userContacts[getContactIdIndex(contactId)];
    resetContactCards();
    await setContacts();
    resetContactInformations(contactInitial, currentContact.name, currentContact.email, currentContact.phone);
    moveEditContactCard(contactInitial, currentContact.name, currentContact.email, currentContact.phone, contactId, 'close');
}