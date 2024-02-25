


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
        console.log("Players:", names_ids_Array.PlayerName);
        console.log("Equipment Ids:", names_ids_Array.EquipmentID);

        console.log(names_ids_Array);


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
                // Call game() function if response is successful
                game();
            } else {
                console.error('Save failed');
            }
        })
        .catch(error => {
            // Log any errors that occur during the fetch operation
            console.error('Error:', error);
        });
    } 






function game() {
    window.location.href = "/load_screen";
}
 
