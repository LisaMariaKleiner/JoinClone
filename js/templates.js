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