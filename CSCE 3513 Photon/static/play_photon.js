




document.addEventListener('DOMContentLoaded', function() {

    function initializeInputs() {
        // Gray out all inputs except the first player input
        document.querySelectorAll('.player-input').forEach((input, index) => {
            input.autocomplete = "off";
            input.value = "";
            if (index !== 0) {
                input.disabled = true;
                input.style.backgroundColor = 'gray'; // Gray placeholder color
            } else {
                input.focus();
            }
        });
    }

    initializeInputs();

    function updateCodeName(input, previousID) {
        const codeNameInput = document.querySelector(`#codeName-container .player-input[id="${input.id}"]`);
        const equipmentInput = document.querySelector(`#equipment-container .player-input[id="${input.id}"]`);
        if (codeNameInput) {
            const playerID = input.value;
            getCodeName(playerID)
                .then(codeName => {
                    if (codeName == "missing") {
                        codeName = prompt('Enter code name for new player ID: ' + playerID);
                        if(codeName !== "") {
                            codeNameInput.value = codeName;
                            insertPlayerToDataBase(playerID, codeName);
                            equipmentInput.readOnly = false;
                        }  else {
                            const index = playerIds.indexOf(input.value);
                            const x = playerIds.splice(index, 1);
                            input.readOnly = false; // Set readOnly directly to false
                            input.value = previousID;
                            input.focus();
                            
                        }
                        
                    } else {
                        codeNameInput.value = codeName;
                    }
                }) 
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }



    function handleInputEvent(input, previousID) {
        if (input.closest('#player-container')) {
            updateCodeName(input, previousID);
        } else if (input.closest('#equipment-container')) {
            const equipmentID = input.value;
            send_udp_message(equipmentID);
        }
    }

    function isNumber(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    let playerIds = [];
    let equipmentIds = [];

    //red_team
    let oddEquipmentCount = 0;

    //green_team
    let evenEquipmentCount = 0;

    
    function isDuplicate(value, array) {
        if(array===playerIds) {
            console.log("DUPLICATE1: ");
            console.log(array);
        }
        for (let i = 0; i < array.length; i++) {
            //let obj = array[i];
            if (value === array[i]) {
                array[i] = value; // Replace the duplicate value in the array
                if(array===playerIds) {
                    console.log("DUPLICATE3: " + array);
                    console.log(array);
                }
                return true;
            } 
            
        }
        if(array===playerIds) {
            console.log("DUPLICATE2: " + array);
            console.log(array);
        }
        return false;
    }
     
        
    function isValidEntry(value, array) {
        if (array === equipmentIds && (value === "43" || value === "53")) {
            alert("Equipment ID cannot be 43 or 53");
            return false;
        } else if (isDuplicate(value, array)) {
            alert("Duplicate Player ID"); 
            return false;
        } else if (value === "") {
           return false;
        } else if (!isNumber(value)) {
            alert("Enter Number");
            return false;
        } else if (array === equipmentIds && evenEquipmentCount == 15 && value % 2 == 0) {
            alert("Green Team is Full");
            return false;
        } else if (array === equipmentIds && oddEquipmentCount === 15 && value % 2 != 0) {
            alert("Red Team is Full");
        } else {
            return true;
        }

    }




    function unlockNextInput(input) {
        const playerInput = document.querySelector(`#player-container .player-input[id="${input.id}"]`);
        const equipmentInput = document.querySelector(`#equipment-container .player-input[id="${input.id}"]`);
        const codeNameInput = document.querySelector(`#codeName-container .player-input[id="${input.id}"]`);

    
        if (playerInput.value !== "" && equipmentInput.value == "") {
            codeNameInput.style.backgroundColor = 'white';
            equipmentInput.disabled = false;
            equipmentInput.readOnly = false;
            equipmentInput.style.backgroundColor = 'white';
            equipmentInput.focus(); // Move focus to the next input
        } else if (playerInput.value !== "" && equipmentInput.value !== "") {
            rowComplete(playerInput, equipmentInput, codeNameInput);
        }
 
    }
    
    function rowComplete(playerInput, equipmentInput, codeNameInput) {
        playerInput.style.backgroundColor = 'yellow';
        equipmentInput.style.backgroundColor = 'yellow';
        codeNameInput.style.backgroundColor = 'yellow';
        unlockNextRow(playerInput); // Unlock the next row after completing this one
   
    }
    
    function unlockNextRow(input) {
        const newID = parseInt(input.id) + 1;
        const newPlayerInput = document.querySelector(`#player-container .player-input[id="${newID}"]`);
        if (newPlayerInput  && equipmentIds.length < 7) {
            newPlayerInput.disabled = false;
            newPlayerInput.readOnly = false;
            newPlayerInput.focus(); // Move focus to the next input
            newPlayerInput.style.backgroundColor = 'white';
        } else if (equipmentIds.length >= 7 && equipmentIds.length != 29){
            addRow();
        }
    }

    var addButton = document.getElementById("add-player-button");
    if (addButton) {
        addButton.addEventListener("click", addRow);
    } else {
        console.error("Button with ID 'add-player-button' not found.");
    }
    function addRow() {
        // Find the container elements
        var playerContainer = document.getElementById("player-container");
        var codeNameContainer = document.getElementById("codeName-container");
        var equipmentContainer = document.getElementById("equipment-container");
    
        // Clone the input elements of the first row
        var playerInput = playerContainer.querySelector('.player-input');
        var codeNameInput = codeNameContainer.querySelector('.player-input');
        var equipmentInput = equipmentContainer.querySelector('.player-input');
    
        var newPlayerInput = playerInput.cloneNode(true);
        var newCodeNameInput = codeNameInput.cloneNode(true);
        var newEquipmentInput = equipmentInput.cloneNode(true);
    
        // Update placeholder and ID for the new inputs
        var id = playerContainer.children.length + 1;
        newPlayerInput.setAttribute('id', id);
        newPlayerInput.setAttribute('placeholder', 'Enter player ID');
        newPlayerInput.value = '';
    
        newCodeNameInput.setAttribute('placeholder', 'Code Name');
        newCodeNameInput.setAttribute('id', id);
        newCodeNameInput.value = '';
    
        newEquipmentInput.setAttribute('placeholder', 'Enter Equipment ID');
        newEquipmentInput.setAttribute('id', id);
        newEquipmentInput.value = '';
    
         // Disable autocomplete and set initial states
        newPlayerInput.autocomplete = "off";
        newPlayerInput.disabled = false;
        newPlayerInput.readOnly = false;
        newPlayerInput.style.backgroundColor = 'white';
    
        newCodeNameInput.autocomplete = "off";
        newCodeNameInput.disabled = true;
        newCodeNameInput.style.backgroundColor = 'gray';
    
        newEquipmentInput.autocomplete = "off";
        newEquipmentInput.disabled = true;
        newEquipmentInput.style.backgroundColor = 'gray';
    
        // Append the new inputs to their respective containers
        playerContainer.appendChild(newPlayerInput);
        codeNameContainer.appendChild(newCodeNameInput);
        equipmentContainer.appendChild(newEquipmentInput);

        newPlayerInput.focus();
    
        const playerInputs = document.querySelectorAll(`#player-container .player-input[id="${id}"]`);
        addInputListeners(playerInputs, playerIds, "Player ID");
        
        // Equipment inputs
        const equipmentInputs = document.querySelectorAll(`#equipment-container .player-input[id="${id}"]`);
        addInputListeners(equipmentInputs, equipmentIds, "Equipment ID");
    
    }


    
    
    
    // Select all player-input elements in both player-container and equipment-container
    function addInputListeners(inputs, ids, errorMessage) {
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (input.readOnly) {
                    return; // Ignore event listener if readOnly is true
                }
                
    
                if (isValidEntry(input.value, ids)) {
                    //unlock the next input box
                    if(ids===playerIds) {
                        console.log("Players1:");
                        console.log(ids);
                    }

                    if(ids===equipmentIds) {
                        if(input.value % 2 == 0) {
                            evenEquipmentCount++;
                        } else {
                            oddEquipmentCount++;
                        }
                    }
                    
                    unlockNextInput(input);
                    ids.push(input.value);
                    handleInputEvent(input, "0");
                    input.readOnly = true;

                    if(ids===playerIds) {
                        console.log("Players2:");
                        console.log(ids);
                    }
                } else {
                    input.value = "";
                    input.focus();
                }
            });
    
            input.addEventListener('dblclick', function() {
                if (!input.readOnly) {
                    return; // Ignore event listener if readOnly is false
                }
    
                const newID = prompt(`Enter New ${errorMessage}`);
                if (isValidEntry(newID, ids)) {
                    previousID = input.value;
                    console.log("NEW ID: " + newID);
                    if(ids===playerIds) {
                        console.log("DblPlayers1 :");
                        console.log(ids);
                    }
                    console.log("ORI ID: " + input.value);
                    const index = ids.indexOf(input.value);
                    ids[index] = newID;

                    if(ids===playerIds) {
                        console.log("DblPlayers2 :");
                        console.log(ids);
                    }
                    
                    if(ids===equipmentIds) {
                        if(newID % 2 == 0 && input.value % 2 != 0) {
                            evenEquipmentCount++;
                            oddEquipmentCount--;
                        } else if (newID % 2 != 0 && input.value % 2 == 0) {
                            oddEquipmentCount++;
                            evenEquipmentCount--;
                        }
                    }
                    input.value = newID;

                    handleInputEvent(input, previousID);
                } else {
                    input.focus();
                }
            });
    
            input.addEventListener('keyup', function(event) {
                if (event.key === 'Enter') {
                    input.blur();
                }
            });
        });
    }
    
    // Player inputs
    const playerInputs = document.querySelectorAll('#player-container .player-input');
    addInputListeners(playerInputs, playerIds, "Player ID");
    
    // Equipment inputs
    const equipmentInputs = document.querySelectorAll('#equipment-container .player-input');
    addInputListeners(equipmentInputs, equipmentIds, "Equipment ID");
    
});



function getCodeName(playerID) {
    return fetch('/get_code_name', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Player_ID: playerID,
        })
    })
    .then(response => {
        if (response.ok) {
            return response.text(); // Get the response text
        } else {
            console.error('Save failed');
            throw new Error('Save failed'); // Throw an error to trigger the catch block
        }
    })
    .catch(error => {
        console.error('Error:', error);
        throw error; // Re-throw the error to propagate it to the caller
    });
}

function insertPlayerToDataBase(playerID, codeName) {
    fetch('/insertPlayerToDataBase', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Player_ID: playerID,
            Code_Name: codeName
        })
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function send_udp_message(code) {
    fetch('/send_udp_message', {
        method: 'POST',
        body: JSON.stringify({ message: code }), // Send the message as JSON in the request body
        headers: {
            'Content-Type': 'application/json' // Set the Content-Type header to application/json
        }
    })
    .catch(error => {
        console.error('Error sending UDP message:', error); // Log any errors that occur during the fetch request or response processing
    });
}


let names_ids_Array = {
    PlayerName: [],
    EquipmentID: []
};

function anyEmptyEquipmentID() {
    const equipmentInputs = document.querySelectorAll(`#equipment-container .player-input`);
    for (let input of equipmentInputs) {
        if (input.value === "" && input.disabled === false) {
            return true;
        }
    }
    return false;
}

function anyEmptyCodeNames() {
    const codeNameInputs = document.querySelectorAll(`#codeName-container .player-input`);
    const playerIDInputs = document.querySelectorAll(`#player-container .player-input`);
    for (let i = 0; i < playerIDInputs.length; i++) {
        if (codeNameInputs[i].value === "" && playerIDInputs[i].value !== "") {
            return true;
        }
    }
    return false;
}

function start_game() {

        // Player inputs
        const playerInput = document.querySelector(`#player-container .player-input[id="${1}"]`);
        
        //check if all code names are loaded
        if (playerInput.value != "" && !anyEmptyCodeNames() ){

            if(playerInput.value != "" && !anyEmptyEquipmentID() ) {
                    // Select all player input elements in the playerNames and red team containers
                var playerNamesArray = document.querySelectorAll('#codeName-container .player-input');
                var equipmentIdsArray = document.querySelectorAll('#equipment-container .player-input');

                //make button red to signify to user that start button is activated
                document.getElementById("save-button").style.backgroundColor = "red";

                // Extract player names from blue team inputs, trim whitespace, and filter out empty names
                var playerNames = Array.from(playerNamesArray)
                .map(input => input.value.trim())  // Trim whitespace from the input value
                .filter(name => {
                    return name !== '';  // Filter out empty names
                })
                .map(name => {
                    // Push the filtered names into the names_ids_Array.PlayerName array
                    names_ids_Array.PlayerName.push(name);
                });


                var equipmentIds = Array.from(equipmentIdsArray)
                .map(input => input.value.trim())  // Trim whitespace from the input value
                .filter(id => {
                    // Log the name being filtered
                    return id !== '';  // Filter out empty names
                })
                .map(id => {
                    // Push the filtered names into the names_ids_Array.PlayerName array
                    names_ids_Array.EquipmentID.push(id);
                });



                // // Send a POST request to Flask server with player names
                fetch('/play_photon/start_game', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        Player_Names: names_ids_Array.PlayerName,
                        Equipment_Ids: names_ids_Array.EquipmentID
                    })
                })
                .then(response => {
                    if (response.ok) {
                        console.log('Save successful');
                        game();
                    } else {
                        console.error('Save failed');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            } else {
                alert("Finish Player Before Starting Game");
            }
        }
        else{
            alert("Wait for all code names to be loaded before continuing!");
        }
        
        
    } 


    function resetInputValues() 
    {
        location.reload();
    }



function game() {
    window.location.href = "/load_screen";
}
 
