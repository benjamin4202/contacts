

var contactsArray = [];

//Init function loaded when the page is loaded
window.onload = function(){

	//Check to see if there is any saved data in local storage, if so load that data into the array.
	if(localStorage.contactData){
		contactsArray = JSON.parse(localStorage.getItem("contactData"));
	}

	//Initialise button events
	buttonEvents();

	//Show that the app has started in the event log
	trackEvents("App has been initialized");

	//load data in the contacts array
	loadContacts();
}

//Load of contact data from contacts array. If localStorage is available in the browser, data persists and is initially loaded.
function loadContacts(){
	
	var contactsContainer = document.getElementById("contactsContainer");

	//If there is no stored data, tell the user to add some.
	if(contactsArray.length <= 0){
		contactsContainer.innerHTML = '<li class="emptyContacts">Use the "Add Contact" button below to add contacts to the list.</li>';
	}
	//Otherwise append the contacts from the array into the contacts container
	for(i=0; i<contactsArray.length; i++){
		contactsArray.sort(function(a, b){return a-b});
		contactsContainer.innerHTML += "<li><a href='#' class='delete' onclick='removeContact(" +[i]+ ")'>x</a><h2>" + contactsArray[i].lastName + ", " + contactsArray[i].firstName + "</h2>" + contactsArray[i].phoneNumber + "</li>";
	}
}

/******* Button Functions *******/
function buttonEvents(){
	document.getElementById('addContactButton').onclick = function(){addContact();}
	document.getElementById('importContacts').onclick = function(){importContacts();};
	document.getElementById('contactsExport').onclick = function(){exportContacts();};
}
/******* End Button Functions *******/


/******* Import and Export Functions *******/
function importContacts(){
	//Get the value of the JSON text area and parse it
	var importList = document.getElementById("contactsJsonContainer").value;
	var parsedImport = JSON.parse(importList);

	//Add the imported data to the contacts array
	for(var x=0; x < parsedImport.length; x++){
		var importedString = {"firstName" : parsedImport[x].firstName, "lastName" : parsedImport[x].lastName, "phoneNumber" : parsedImport[x].phoneNumber};
		contactsArray.push(importedString);
	}
	//Show the list import was successful in the event log
	trackEvents("Contact list has been imported from the JSON data container.");
	//Clear and reload the contacts list
	contactsContainer.innerHTML = "";
	loadContacts();
}
function exportContacts(){

	//Stringify the contacts array and display the string in the JSON text area
	document.getElementById("contactsJsonContainer").value = JSON.stringify(contactsArray);

	//Show that the contact list was exported in the event log
	trackEvents("Current contact list has been exported to the JSON data container.");
}
/******* End Import and Export Functions *******/

/******* Add/Remove Contacts *******/
function addContact(){
	//Get the values from the input fields in the add contact modal
	var first_name = document.getElementById("firstName").value,
		last_name = document.getElementById("lastName").value,
		phone_number = document.getElementById("phoneNumber").value,
		contactString = {"firstName" : first_name, "lastName" : last_name, "phoneNumber" : phone_number};
	//Make sure a user does not add an empty contact 
	if(first_name == '' || last_name == '' || phone_number == ''){
		alert('You must fill out all fields to add a new contact!');
		return;
	}
	
	//Add the new contact to the contacts array
	contactsArray.push(contactString);
	
	//Show that a new user has been added in the event log
	trackEvents("Contact " +first_name+ " " +last_name+ " added to contact list.");

	//Send the contact array to local storage on this user's browser.
	localStorage.setItem("contactData", JSON.stringify(contactsArray));
	
	//Clear all the fields in the add contact modal so that it is empty the next time a user adds a contact
	resetInputValues();
	//Clear and reload the contacts list
	contactsContainer.innerHTML = "";
	loadContacts();
}

function removeContact(index){
	//Make sure the user really wants to delete the contact
	var areYouSure = confirm('Are you sure you want to delete this contact? This action can not be undone.');
	//If they are sure, go ahead and remove it from the contacts array, clear and reload the contacts list
	if(areYouSure == true){
		trackEvents("Contact " +contactsArray[index].firstName+ " " +contactsArray[index].lastName+ " removed from contact list.");
		contactsArray.splice(index, 1);
		localStorage.setItem("contactData", JSON.stringify(contactsArray));
		contactsContainer.innerHTML = "";
		loadContacts();
	}else{
		//If they weren't sure, don't delete the contact
		return;
	}
}
/******* end Add/Remove Contacts ********/

/******* Reset Function *******/
function resetInputValues(){
		//Set the input values to null
		document.getElementById("firstName").value = "";
		document.getElementById("lastName").value = "";
		document.getElementById("phoneNumber").value = "";
}
/******* End Reset Function *******/

/******* Event Tracking *******/
function trackEvents(userEvent){
	//Send the specified event to the events log box.
	var eventTrackingContainer = document.getElementById("events");
	eventTrackingContainer.insertAdjacentHTML("afterbegin", "<p> --> " +userEvent+ "</p>");
}
/******* end Event Tracking *******/