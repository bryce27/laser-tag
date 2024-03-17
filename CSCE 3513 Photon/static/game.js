let red_team = {
    PlayerName: [],
    EquipmentID: []
};

let green_team = {
    PlayerName: [],
    EquipmentID: []
};

function getRandomImageUrl() {
    return imageURLs[Math.floor(Math.random() * imageURLs.length)];
}

function assignTeams(array) {
    let i = 0;
    array.forEach(function(item) {
        if (parseInt(item.equipment_id) % 2 == 0) {
            green_team.EquipmentID.push(item.equipment_id);
            green_team.PlayerName.push(item.name)
        } else {
            red_team.EquipmentID.push(item.equipment_id);
            red_team.PlayerName.push(item.name)
        }

        i++;

    });


}




function fetchAndProcessPlayerData() {
    return fetch('/get_data')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(playerData => {
            // Process the player data
            assignTeams(playerData);
            populate_scoreBoard(red_team, '#table1');
            populate_scoreBoard(green_team, '#table2');
            
        })
        .catch(error => {
            console.error('Error fetching or processing player data:', error);
            throw error; // Re-throw the error to propagate it
        });
}

// Usage example:
fetchAndProcessPlayerData()
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
    });

   





//populate_scoreBoard(red_team, '#table2');




function populate_scoreBoard(array, table_id) {
    // Get a reference to the table body
        array.PlayerName.forEach(obj => {
            const tableBody = document.querySelector(`${table_id} tbody`);

            // Create a new table row
            const newRow = document.createElement('tr');

            // Create new table data cells for player, name, and score
            const playerCell = document.createElement('td');
            const playerImage = document.createElement('img');
            playerImage.src = getRandomImageUrl();
            playerImage.alt = 'Player Image'; // Set the alt attribute
            playerCell.appendChild(playerImage); // Append the image to the cell

            const nameCell = document.createElement('td');
            nameCell.textContent = obj;

            const scoreCell = document.createElement('td');
            scoreCell.textContent = 'New Score';

            // Append the cells to the row
            newRow.appendChild(playerCell);
            newRow.appendChild(nameCell);
            newRow.appendChild(scoreCell);

            // Append the new row to the table body
            tableBody.appendChild(newRow);
        }) 
}

document.addEventListener('DOMContentLoaded', function () {
    const numberOfStars = 50; // Adjust the number of stars as needed
    const starsContainer = document.querySelector('.stars');

    for (let i = 0; i < numberOfStars; i++) {
        createStar();
    }

    function createStar() {
        const star = document.createElement('div');
        star.classList.add('star');
        setStarPosition(star);
        starsContainer.appendChild(star);
    }

    function setStarPosition(star) {
        const posX = Math.random() * window.innerWidth;
        const posY = Math.random() * window.innerHeight;

        star.style.left = `${posX}px`;
        star.style.top = `${posY}px`;
    }
});

// Makes sure most recent update is visible 
function addTextToScreen(text) {
    const updateScreen = document.getElementById('game-action');
    let newText = document.createElement('option');
    newText.text = text;
    updateScreen.add(newText);
    scrollToBottom();
}

function scrollToBottom() {
    var updateScreen = document.getElementById("game-action");
    if (updateScreen)
        updateScreen.scrollTop = updateScreen.scrollHeight;
}





function send_udp_message(code) {
    fetch('/send_udp_message', {
        method: 'POST',
        body: JSON.stringify({ message: code }), // Send the message as JSON in the request body
        headers: {
            'Content-Type': 'application/json' // Set the Content-Type header to application/json
        }
    })
    .then(response => {
        // Check if the response is OK
        if (!response.ok) {
            throw new Error('Failed to send UDP message'); // Throw an error if the response is not OK
        }
        return response.body.getReader(); // Return a ReadableStream object to read the response body
    })
    .then(reader => {
        // Define a function to process each chunk of data as it arrives
        const processChunk = ({ done, value }) => {
            if (done) {
                console.log('All data received'); // Log a message when all data has been received
                return;
            }
            const message = new TextDecoder().decode(value); // Decode the chunk of data to a string
            console.log('UDP message received:', message); // Log the received message
            if (message.includes(":53")) {
                let [eqID, base] = message.split(':');
                eqID = green_team.EquipmentID.indexOf(parseInt(eqID));
                playerName = green_team.PlayerName[eqID];
                addTextToScreen("Red Base Scored by " + playerName);

            } else if (message.includes(":43")) {
                let [eqID, base] = message.split(':');
                eqID = red_team.EquipmentID.indexOf(parseInt(eqID));
                playerName = red_team.PlayerName[eqID];
                addTextToScreen("Green Base Scored by " + playerName);
            } else if (!(message.includes(":"))) {
                    addTextToScreen(message);
            } else {
                text = processHit(message);
                if (!text.includes(undefined))
                    addTextToScreen(text);
            }
            reader.read().then(processChunk); // Read the next chunk of data and process it recursively
        };

        // Start reading the response body as a stream and process each chunk
        reader.read().then(processChunk);
    })
    .catch(error => {
        console.error('Error sending UDP message:', error); // Log any errors that occur during the fetch request or response processing
    });
}





// Function to process the hit and return the result
function processHit(message) {
    let [shot, hit] = message.split(':');
    if (shot % 2 == 0) {
        shotIndex = green_team.EquipmentID.indexOf(parseInt(shot));
        shotName = green_team.PlayerName[shotIndex];
    } else {
        shotIndex = red_team.EquipmentID.indexOf(parseInt(shot));
        shotName = red_team.PlayerName[shotIndex];
    }

    if (hit % 2 == 0) {
        hitIndex = green_team.EquipmentID.indexOf(parseInt(hit));
        hitName = green_team.PlayerName[hitIndex];
    } else {
        hitIndex = red_team.EquipmentID.indexOf(parseInt(hit));
        hitName = red_team.PlayerName[hitIndex];
    }

    return shotName + " hit " + hitName;
    

    // if (greenPlayer && redPlayer) {
    //     return greenPlayer + " hit " + redPlayer;
    // } else {
    //     return "One or both players not found";
    // }
}

send_udp_message("202");
send_udp_message("221");