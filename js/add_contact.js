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
  console.log(users);
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
    phone: newContactPhone,
  };

  let currentUserData = JSON.parse(localStorage.user);
  let currentUserContacts = currentUserData.contacts;
  currentUserContacts.push(newContact);
  localStorage.setItem("user", JSON.stringify(currentUserData));
  clearNewContactForm();
  await updateUserInRemoteStorage(currentUserData);
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
    // Find the user in the remote Storage and give the Index back
    const userIndex = remoteUsersData.findIndex(
      (u) => u.email === userEmail && u.password === userPassword
    );

    if (userIndex !== -1) {
      // Updates the data of the user
      remoteUsersData[userIndex] = {
        ...remoteUsersData[userIndex],
        ...updatedUserData,
      };

      // User will be updated in the remote Storage
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

function addOpenedContactAnimation(contactInformationCard) {
  contactInformationCard.style.display = "flex";
  contactInformationCard.classList.add("slide_in");
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

function createContactCard(
  contactInitial,
  contactName,
  contactEmail,
  contactPhone,
  contactId
) {
  return /*html*/ `
                    <div id="contact_${contactId}" class="contact" onclick="showContactInformation('${contactInitial}', '${contactName}', '${contactEmail}', '${contactPhone}', '${contactId}')">
                        <div class="task_member first_member">
                            <span class="color_white">${contactInitial}</span>
                        </div>
                        <div class="member_shortinfo">
                            <span id="contact_card_name_${contactId}">${contactName}</span>
                            <span><a>${contactEmail}</a></span>
                        </div>
                    </div>
    `;
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
  let contactName = contacts[contactId].name;
  let contactEmail = contacts[contactId].email;
  let contactPhone = contacts[contactId].phone;
  document.getElementById("edit_contact_initials").innerText = contactInitial;
  document.getElementById("edit_contact_name").value = contactName;
  document.getElementById("edit_contact_email").value = contactEmail;
  document.getElementById("edit_contact_phone").value = contactPhone;
}

/*function handleContact(contactId) {
  if (isset($_POST["save_button"])) {
    saveContact(contactId);
  } else if (isset($_POST["delete_button"])) {
    deleteContact(contactId);
  }
}
*/
async function saveContact(contactId) {
  // Zieht die Value aus den Input Feldern: Name, Email, Phone
  const editedContactName = edit_contact_name.value;
  const editedContactEmail = edit_contact_email.value;
  const editedContactPhone = edit_contact_phone.value;

  console.log(edit_contact_name.value);

  // Aktualisiert die Daten im Array contacts[contactId]
  let currentContact = contacts[contactId];
  currentContact.name = editedContactName;
  currentContact.email = editedContactEmail;
  currentContact.phone = editedContactPhone;

  // Aktualisiert die Kontakte im LocalStorage
  currentUser = JSON.parse(localStorage.getItem("user"));
  currentUser.contacts = contacts;

  currentUser = JSON.stringify(currentUser);

  // Gebe den aktualisierten Stand des Users in die Funktion und aktualisiert somit den User im RemoteStorage
  await updateUserInRemoteStorage(currentUser);
}

async function deleteContact(contactId) {
  const currentUserData = JSON.parse(localStorage.user);
  let currentUserContacts = currentUserData.contacts;

  // Überprüfe, ob der Kontaktindex innerhalb des gültigen Bereichs liegt
  if (contactId >= 0 && contactId < currentUserContacts.length) {
    // Entferne den Kontakt anhand des Index
    currentUserContacts.splice(contactId, 1);

    // Aktualisiere die IDs der verbleibenden Kontakte
    for (let i = contactId; i < currentUserContacts.length; i++) {
      currentUserContacts[i].id = i;
    }

    // Aktualisiere den Benutzerdatensatz mit den geänderten Kontakten
    currentUserData.contacts = currentUserContacts;

    // Speichere die aktualisierten Daten im lokalen Speicher
    localStorage.setItem("user", JSON.stringify(currentUserData));

    // Aktualisiere die Daten im Remote-Speicher
    await updateUserInRemoteStorage(currentUserData);

    // Optional: Aktualisiere die Ansicht
    await setContacts();
    renderContactLetterContainer();
    init();
  }
}


function createEditCard(
  contactName,
  contactEmail,
  contactPhone,
  contactId,
  contactInitial
) {
  return /*html*/ `
           <div id="edit_contact_card" class="edit_contact_card"> 
                <div class="left_side">
                    <img src="./assets/img/joinLogoLight.png" alt="Join Logo">
                    <h2>Edit contact</h2>
                    <div class="left_side_seperator"></div>
                </div>
                <div class="right_side">
                    <button class="close_contact_card_button" onclick="moveEditContactCard('${contactInitial}', '${contactName}', '${contactEmail}', '${contactPhone}', '${contactId}', 'close')">
                        <img src="./assets/img/x.png" alt="Close Button">
                    </button>
                    <div class="edit_contact_profile_picture">
                        <span id="edit_contact_initials">${contactInitial}"</span>
                    </div>
                    <div class="edit_contact_input_container">
                        <form onsubmit="saveContact(${contactId}); return false">
                            <div class="input_container">
                                <input type="name" id="edit_contact_name" value="${contactName}" placeholder="Name">
                                <div class="input_icon_container">
                                    <img src="./assets/img/person.png" alt="Name Icon">
                                </div>
                            </div>
                            <div class="input_container">
                                <input type="email" id="edit_contact_email" value="${contactEmail}" placeholder="Email">
                                <div class="input_icon_container">
                                    <img src="./assets/img/mail.png" alt="Email Icon">
                                </div>
                            </div>
                            <div class="input_container">
                                <input type="tel" id="edit_contact_phone" value="${contactPhone}" placeholder="Phone">
                                <div class="input_icon_container">
                                    <img src="./assets/img/call.png" alt="Phone Icon">
                                </div>
                            </div>
                            <div class="edit_contact_button_container">
                                <button id="delete_contact_button" class="secondary_button" value="${contactId}">
                                    Delete
                                </button>
                                <button class="primary_button save_contact_button">
                                    Save
                                    <img src="./assets/img/done.png" alt="Create Contact">
                                </button>
                            </div>
                        </form>
                        
                    </div>
                </div>
            </div>`;
}
