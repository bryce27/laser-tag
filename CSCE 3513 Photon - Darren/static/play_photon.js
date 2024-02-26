function start_game() {
    if (checkDuplicates() == 0) {
        var bluePlayers = document.querySelectorAll('#blue-container .player-input');
        var redPlayers = document.querySelectorAll('#red-container .player-input');
        var bluePlayerNames = Array.from(bluePlayers)
            .map(input => input.value.trim())  // Trim whitespace from the input value
            .filter(name => name !== '');     // Filter out empty names

        var redPlayerNames = Array.from(redPlayers)
            .map(input => input.value.trim())  // Trim whitespace from the input value
            .filter(name => name !== '');
        
        console.log("Blue Team Players:", bluePlayerNames);
        console.log("Red Team Players:", redPlayerNames);
    
        // Send a POST request to Flask server with player names
        fetch('/play_photon/start_game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bluePlayers: bluePlayerNames,
                redPlayers: redPlayerNames
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
        console.log("duplicates");
    }

    
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function checkDuplicates() {
    var bluePlayers = document.querySelectorAll('#blue-container .player-input');
    var redPlayers = document.querySelectorAll('#red-container .player-input');
    
    var allPlayers = Array.from(bluePlayers).concat(Array.from(redPlayers));

    var playerNames = [];
    var duplicateNames = [];

    allPlayers.forEach(function(player) {
        var name = player.value.trim();
        if (name !== '') {
            if (playerNames.includes(name)) {
                console.log(name);
                duplicateNames.push(name);
            } else {
                playerNames.push(name);
            }
        }
    });

    if (duplicateNames.length > 0) {
        console.log(duplicateNames.join(", "));
        var message = 'Duplicate player names found: ' + duplicateNames.join(', ');
        alert(message);
    }

    return duplicateNames.length
}


function game() {
    window.location.href = "/load_screen";
}