

document.addEventListener('DOMContentLoaded', function() {
    
    //function that updates the code name
    function updateCodeName(input) {
        const codeNameInput = document.querySelector(`#codeName-container .player-input[id="${input.id}"]`);
        if (codeNameInput) {
            const playerID = input.value;
            getCodeName(playerID)
                .then(codeName => {
                    if (codeName == "missing") {
                        codeName = prompt('Please enter code name for the following ID: ' + playerID);
                        codeNameInput.value = codeName;
                        insertPlayerToDataBase(playerID, codeName);
                    } else {
                        codeNameInput.value = codeName;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }

    //pointer to accessable row
    let currentRow = 1;
    
    //create a 2D array of 8 players, for error handling purposes
    let allPlayers = [];
    for (let i = 0; i < 8; i++){
        allPlayers.push(['','']);
    }

    //MAIN ACTIONS THAT OCCUR UPON EACH INPUT
    function handleInputEvent(input) {
        if (input.closest('#player-container')) {
            updateCodeName(input);
            const playerID = input.value;
            while (checkForDuplicateEntries(input.value, 0) == true){
                input.value = prompt('Please enter a unique player ID: ' + playerID);
            }
            allPlayers[currentRow-1][0] = input.value;
        } else if (input.closest('#equipment-container')) {
            const equipmentID = input.value;
            send_udp_message(equipmentID);
            allPlayers[currentRow-1][1] = input.value;
        }

        if((allPlayers[currentRow-1][0] != '') && (allPlayers[currentRow-1][1] != '') && (currentRow <= 8))
            {   //only unlock next row if contents are in both sides, and there are more rows to fill
                currentRow++;
                enableInputsInCurrentRow();
                disableInputsInPreviousRow();
            }
    }

    //sort through array for duplicate entries, return true or false if found.
    function checkForDuplicateEntries(value, id){
        let duplicationChecker = false;
        for (let i = 0; i < 8; i++){
            if (value == allPlayers[i, id]){
                duplicationChecker = true;
            }
        }
        return duplicationChecker;
    }


    // Select all player-input elements in both player-container and equipment-container
    const playerInputs = document.querySelectorAll('#player-container .player-input, #equipment-container .player-input');

    //Disable access of all boxes except initial one
    playerInputs.forEach((input, index) => {
        if (index !== 0){
            input.setAttribute('readonly', 'readonly');
            input.style.backgroundColor = 'gray';
        }
    });

    function enableInputsInCurrentRow() {
        // Find the inputs in row and enable them
        const currentRowInputs = document.querySelectorAll(`#player-container .player-input[id^="${currentRow}"],
                                                            #equipment-container .player-input[id^="${currentRow}"]`);
        currentRowInputs.forEach(input => {
            input.removeAttribute('readonly');  //allow typable
            input.style.backgroundColor = '';   //reset background color
        });
    }

    function disableInputsInPreviousRow() {
        // Find the inputs in row and enable them
        const currentRowInputs = document.querySelectorAll(`#player-container .player-input[id^="${currentRow-1}"],
                                                            #equipment-container .player-input[id^="${currentRow-1}"]`);
        currentRowInputs.forEach(input => {
            input.setAttribute('readonly', 'readonly');
            input.style.backgroundColor = 'rgb(255, 247, 87)';
        });
    }

    // Attach event listeners to each input element
    playerInputs.forEach(input => {
        input.addEventListener('blur', function() {
            handleInputEvent(input);
        });

        input.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                handleInputEvent(input);
            }
        });
    });

    // Enable inputs in the first row initially
    enableInputsInCurrentRow();
});



function getCodeName(playerID) {
    console.log("PLAYER ID " + playerID);
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



function start_game() {

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
        
    } 


    function resetInputValues() 
    {
        location.reload();
    }



function game() {
    window.location.href = "/load_screen";
}
 
