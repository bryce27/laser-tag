


let names_ids_Array = {
    PlayerName: [],
    EquipmentID: []
};


function start_game() {

        // Select all player input elements in the blue and red team containers
        var playerNamesArray = document.querySelectorAll('#player-container .player-input');
        var equipmentIdsArray = document.querySelectorAll('#equipment-container .player-input');

        // Extract player names from blue team inputs, trim whitespace, and filter out empty names
        var playerNames = Array.from(playerNamesArray)
        .map(input => input.value.trim())  // Trim whitespace from the input value
        .filter(name => {
            // Log the name being filtered
            return name !== '';  // Filter out empty names
        })
        .map(name => {
            // Push the filtered names into the names_ids_Array.PlayerName array
            names_ids_Array.PlayerName.push(name);
        });


        // Extract player names from red team inputs, trim whitespace, and filter out empty names
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

        // Log blue team player names and red team equipment IDs to the console
       // console.log("Player ID:", names_ids_Array.PlayerName);
       // console.log("Equipment Ids:", names_ids_Array.EquipmentID);

        //console.log(names_ids_Array);


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
            // Handle response from the server
            if (response.ok) {
                console.log('Save successful');
                return response.json();
            } else {
                console.error('Save failed');
            }
        })
        .then(data => {
            if (data && data.missing_ids && data.missing_ids.length > 0) {
                // Prompt the user to input missing names
                missingNameAnswers = [];
                missingEquipment = data.missing_equipment;
                for (var obj of data.missing_ids) {
                    var currentName;
                    do {
                        currentName = prompt('Please enter names for the following ID: ' + obj);
                    } while (!currentName); // Loop until the user provides a non-empty input
                    missingNameAnswers.push(currentName);
                }
                //const missingNames = prompt('Please enter names for the following IDs: ' + data.missing_ids.join(', '));
                if (missingNameAnswers) {
                    // Send missing names back to Flask
                    fetch('/handle_missing_names', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            Player_Names: missingNameAnswers,
                            Equipment_Ids: missingEquipment,
                            Player_Ids: data.missing_ids
                        })
                    })
                    .then(response => {
                        if (response.ok) {
                            console.log('Missing names saved successfully');
                        } else {
                            console.error('Saving missing names failed');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                }
            } else {
                console.log(data.message); // Log the message
            }
            game();
        })
        .catch(error => {
            console.error('Error:', error);
        });
        
    } 


    function resetInputValues() 
    {
        var playerInputs = document.querySelectorAll('#player-container .player-input');
        playerInputs.forEach(function(input) 
        {
            input.value = "";
        });
        var equipmentInputs = document.querySelectorAll('#equipment-container .player-input');
        equipmentInputs.forEach(function(input) 
        {
            input.value = "";
        });
    }
    document.addEventListener('keydown', function(event) 
    {
        if (event.key === 'F12') 
        {
            resetInputValues();
        }
    });



function game() {
    window.location.href = "/load_screen";
}
 
