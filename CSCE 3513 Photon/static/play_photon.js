document.addEventListener('DOMContentLoaded', function() {
    function initializeInputs() {
        // Gray out all inputs except the first player input
        document.querySelectorAll('.player-input').forEach((input, index) => {
            input.autocomplete = "off";
            input.value = "";
            if (index !== 0) {
                console.log("INPUT " + input.value)
                input.disabled = true;
                input.style.backgroundColor = 'gray'; // Gray placeholder color
            } else {
                input.focus();
            }
        });
    }

    initializeInputs();
});




document.addEventListener('DOMContentLoaded', function() {
    function updateCodeName(input, previousID) {
        const codeNameInput = document.querySelector(`#codeName-container .player-input[id="${input.id}"]`);
        const equipmentInput = document.querySelector(`#equipment-container .player-input[id="${input.id}"]`);
        if (codeNameInput) {
            const playerID = input.value;
            getCodeName(playerID)
                .then(codeName => {
                    if (codeName == "missing") {
                        codeName = prompt('Enter code name for new player ID: ' + playerID);
                        console.log("CODENAME " + codeName);
                        if(codeName !== "") {
                            codeNameInput.value = codeName;
                            insertPlayerToDataBase(playerID, codeName);
                            equipmentInput.readOnly = false;
                        }  else {
                            console.log("INPUTTT " + input.value);
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

    
    function isDuplicate(value, array) {
        for (let i = 0; i < array.length; i++) {
            const obj = array[i];
            if (value === obj) {
                array[i] = value; // Replace the duplicate value in the array
                return true;
            } 
        }
        return false;
    }
     
        
    function isValidEntry(value, array) {
        if (isDuplicate(value, array)) {
            alert("Duplicate Player ID"); 
            return false;
        } else if (value == "") {
           return false;
        } else if (!isNumber(value)) {
            alert("Enter Number");
            return false;
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
        if (newPlayerInput) {
            newPlayerInput.disabled = false;
            newPlayerInput.readOnly = false;
            newPlayerInput.focus(); // Move focus to the next input
            newPlayerInput.style.backgroundColor = 'white';
        }
    }
    
    
    
    // Select all player-input elements in both player-container and equipment-container
    function addInputListeners(inputs, ids, errorMessage) {
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                console.log("blur");
                console.log(input.readOnly);
                if (input.readOnly) {
                    return; // Ignore event listener if readOnly is true
                }
                
    
                if (isValidEntry(input.value, ids)) {
                    //unlock the next input box
                    unlockNextInput(input);
                    ids.push(input.value);
                    handleInputEvent(input, "0");
                    input.readOnly = true;
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
                    unlockNextInput(input);
                    previousID = input.value;
                    ids.push(newID);
                    ids = ids.filter(item => item !== input.value);
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

function start_game() {

        // Player inputs
        const playerInput = document.querySelector(`#player-container .player-input[id="${1}"]`);
        
        

        if(playerInput.value != "" && !anyEmptyEquipmentID() ) {
                // Select all player input elements in the playerNames and red team containers
            var playerNamesArray = document.querySelectorAll('#codeName-container .player-input');
            var equipmentIdsArray = document.querySelectorAll('#equipment-container .player-input');

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


    function resetInputValues() 
    {
        location.reload();
    }



function game() {
    window.location.href = "/load_screen";
}
 
