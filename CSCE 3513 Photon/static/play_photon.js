
document.addEventListener('DOMContentLoaded', function() {
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

    function handleInputEvent(input) {
        if (input.closest('#player-container')) {
            updateCodeName(input);
        } else if (input.closest('#equipment-container')) {
            const equipmentID = input.value;
            send_udp_message(equipmentID);
        }
    }

    // Select all player-input elements in both player-container and equipment-container
    const playerInputs = document.querySelectorAll('#player-container .player-input, #equipment-container .player-input');

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
 
