let red_team = {
    PlayerName: [],
    EquipmentID: []
};

let green_team = {
    PlayerName: [],
    EquipmentID: []
};

function getRandomImageUrl() {
    console.log(Math.floor(Math.random() * imageURLs.length));
    console.log(imageURLs[Math.floor(Math.random() * imageURLs.length)]);
    return imageURLs[Math.floor(Math.random() * imageURLs.length)];
}

function assignTeams(array) {
    let i = 0;
    console.log("HEYYYYYYY");
    console.log(array);
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

    console.log(`Green Team: ${red_team.PlayerName}`);
   // console.log(green_team);
}

function fetchPlayerData() {
    return fetch('/get_data')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Process the data as needed
            console.log('Player data:', data);
            return data; // Return the player data
        })
        .catch(error => {
            console.error('Error fetching player data:', error);
            throw error; // Re-throw the error to propagate it
        });
}

// Usage example:
fetchPlayerData()
    .then(playerData => {
        // Handle the player data
        assignTeams(playerData)
        populate_scoreBoard(red_team, '#table1');
        populate_scoreBoard(green_team, '#table2');
        console.log('Received player data:', playerData.data)
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
    });







//populate_scoreBoard(red_team, '#table2');




function populate_scoreBoard(array, table_id) {
    // Get a reference to the table body
        console.log(`Green Team: ${array.PlayerName}`);
        array.PlayerName.forEach(obj => {
            const tableBody = document.querySelector(`${table_id} tbody`);

            // Create a new table row
            const newRow = document.createElement('tr');

            // Create new table data cells for player, name, and score
            const playerCell = document.createElement('td');
            const playerImage = document.createElement('img');
            playerImage.src = getRandomImageUrl();
            console.log(playerImage.src);
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
function scrollToBottom() {
    var updateScreen = document.getElementById("game-action");
    if (updateScreen)
        updateScreen.scrollTop = updateScreen.scrollHeight;
}

document.addEventListener('DOMContentLoaded', function() {
    // Add game updates to action window 
    function addTextToScreen(text) {
    const updateScreen = document.getElementById('game-action');
    let newText = document.createElement('option');
    newText.text = text;
    updateScreen.add(newText);
    }
    scrollToBottom();
});



fetch('/send_udp_message', {
    method: 'POST'
})
.then(response => {
    if (!response.ok) {
        throw new Error('Failed to send UDP message');
    }
    return response.json();
})
.then(data => {
    console.log('UDP message sent:', data.message);
})
.catch(error => {
    console.error('Error sending UDP message:', error);
});