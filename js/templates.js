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

function createContactCard(
  contactInitial,
  contactName,
  contactEmail,
  contactPhone,
  contactId
) {
  let userContact = user.contacts.find((contacts) => contacts.name === contactName);
  let backgroundColorStyle = userContact
    ? `style="background-color: ${userContact.contactBackgroundColor}"`
    : "";
  return /*html*/ `
    <div id="contact_${contactId}" class="contact" onclick="showContactInformation('${contactInitial}', '${contactName}', '${contactEmail}', '${contactPhone}', '${contactId}')">
      <div class="task_member first_member" ${backgroundColorStyle}>
        <span class="color_white">${contactInitial}</span>
      </div>
      <div class="member_shortinfo">
        <span id="contact_card_name_${contactId}">${contactName}</span>
        <span><a>${contactEmail}</a></span>
      </div>
    </div>
  `;
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
                          <span id="edit_contact_initials">${contactInitial}</span>
                      </div>
                      <div class="edit_contact_input_container">
                          <form onsubmit="saveContact(${contactId}); 
                                          renderContactInformation(${contactId}, '${contactInitial}');
                                          return false">
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
                                  <button onclick="deleteContact(${contactId})" id="delete_contact_button" class="secondary_button" value="${contactId}">
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

function createTask(element) {
  return /*html*/ `
      <div class="task_card" draggable="true" ondragstart="startDragging(${element.id})" onclick="openTaskDetailsCard(${element.id}, 'open')">
          <h3 class="user_story">${element.taskCategory}</h3>
          <div class="task_information">
              <h2>${element.title}</h2>
              <p>${element.description}</p>
          </div>
          <div class="subtask_progress_container" id="subtask_progress_container_${element.id}">
              <div class="subtask_progressbar">
                  <div id="subtask_progressbar_task_${element.id}" class="current_subtask_progress"></div>
              </div>
              <span id="subtask_counter_${element.id}">0/${element["subtasks"].length} Subtasks</span>
          </div>
          <div class="task_footer">
              <div class="task_member_container" id="task_member_container_${element.id}">
                  
              </div>
              <div id="task_urgency_information_${element["id"]}" class="task_urgency_information">
              </div>
          </div>
      </div>
    `;
}

function createAssignedContact(contactInitials, randomBackground) {
  return /*html*/ `
            <div class="assigned_initials" style="background-color: ${randomBackground}">
            ${contactInitials}
            </div>
    `;
}

function createAssignedContactInDetails(
  contactName,
  initials,
  randomBackground
) {
  return /*html*/ `
                <div class="assigned_contact">
                    <div class="assigned_initials" style="background-color: ${randomBackground}">${initials}</div>
                    <div class="assigned_name">${contactName}</div>
                </div>
    `;
}
