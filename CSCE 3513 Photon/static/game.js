let red_team = {
    PlayerName: [],
    EquipmentID: [],
    Offset: [0,0,0]
};

let green_team = {
    PlayerName: [],
    EquipmentID: [],
    Offset: [0,0,0]
};

document.addEventListener('DOMContentLoaded', function() {
    timer();
});

async function timer() {
    let mins = Math.floor(document.getElementById('mins').innerHTML);
    let secs = Math.floor(document.getElementById('secs').innerHTML);
    secs = secs + (mins * 60);
    if (secs > 0) {
        secs = secs - 1;

        document.getElementById('mins').innerHTML = parseInt((secs / 60), 10);
        secs = secs % 60;
        if (secs < 10) {
            document.getElementById('secs').innerHTML = "0" + secs;
        } else {
            document.getElementById('secs').innerHTML = secs;
        }
        setTimeout(timer, 1000);
    } else {
        send_udp_message('221');
        send_udp_message('221');
        send_udp_message('221');
    }
    
}

const redTableId = "red_team";
const greenTableId = "green_team";

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

function flashHigherScoreTeam(redTeamId, greenTeamId) {
    const redTotalScoreElement = document.querySelector(`#${redTeamId} thead tr:first-child th:nth-child(2)`);
    const redScore = parseInt(redTotalScoreElement.textContent.match(/-?\d+/)[0], 10);
    const redTeamTitle = document.querySelector(`#${redTeamId} thead tr:first-child th:nth-child(1)`);


    const greenTotalScoreElement = document.querySelector(`#${greenTeamId} thead tr:first-child th:nth-child(2)`);
    const greenScore = parseInt(greenTotalScoreElement.textContent.match(/-?\d+/)[0], 10);
    const greenTeamTitle = document.querySelector(`#${greenTeamId} thead tr:first-child th:nth-child(1)`);


    redTotalScoreElement.classList.remove('flashRed');
    redTeamTitle.classList.remove('flashRed');
    greenTotalScoreElement.classList.remove('flashGreen');
    greenTeamTitle.classList.remove('flashGreen');

    if (redScore > greenScore) {
        redTotalScoreElement.classList.add('flashRed');
        redTeamTitle.classList.add('flashRed');
    } else if (greenScore > redScore) {
        greenTotalScoreElement.classList.add('flashGreen');
        greenTeamTitle.classList.add('flashGreen');
    }
}




function setScore(table_id, rowNumber, indicator, hitOrShot) {
    const tableBody = document.querySelector(`#${table_id} tbody`);
    const totalScoreElement = document.querySelector(`#${table_id} thead tr:first-child th:nth-child(2)`);
    const currentScore = parseInt(totalScoreElement.textContent.match(/-?\d+/)[0], 10);
    console.log("Row No. " + rowNumber);
    console.log("Current Score " + table_id + " " + currentScore);
    const row = tableBody.querySelector(`tr:nth-child(${rowNumber + 1})`);
    if (indicator == "base") {
        console.log("100");
        row.cells[2].textContent = parseInt(row.cells[2].textContent) + 100;
        row.cells[1].innerHTML = `<span style="font-size: larger; font-weight: bold; color: gold;">B </span>${row.cells[1].textContent}`;
        const newScore = currentScore + 100;
        console.log("Score: " + newScore);
        totalScoreElement.textContent = `Total Score: ${newScore}`;
    } else {
        if (hitOrShot == "wasHit") {
            console.log("-10");
            row.cells[2].textContent = parseInt(row.cells[2].textContent) - 10;
            const newScore = currentScore - 10;
            console.log("Score: " + newScore);
            totalScoreElement.textContent = `Total Score: ${newScore}`;
        }

        else if (hitOrShot == "shooter") {
            console.log("10");
            row.cells[2].textContent = parseInt(row.cells[2].textContent) + 10;
            const newScore = currentScore + 10;
            console.log("Score: " + newScore);
            totalScoreElement.textContent = `Total Score: ${newScore}`;
        }

    }

    flashHigherScoreTeam(redTableId, greenTableId);
    
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
            populate_scoreBoard(green_team, greenTableId);
            populate_scoreBoard(red_team, redTableId);
            console.log("Green " + red_team.PlayerName + " " + red_team.EquipmentID);
            console.log("Red " + green_team.PlayerName +  " " + green_team.EquipmentID);
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
            const tableBody = document.querySelector(`#${table_id} tbody`);

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
            scoreCell.textContent = '0';

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

function reorderRows(table_id, array) {
    const tableBody = document.querySelector(`#${table_id} tbody`);
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    const offsetArray = [];

    rows.sort((a, b) => {
        const scoreA = parseInt(a.cells[2].textContent);
        const scoreB = parseInt(b.cells[2].textContent);
        return scoreB - scoreA; // Sort in descending order
    });

    i = 0;
    rows.forEach(row => {
        tableBody.appendChild(row); // Append each row in the sorted order
        // Extract the name from the second cell and push it into the namesArray
        let name = row.cells[1].textContent;
        if (name.startsWith("B ")) {
            name = name.substring(2); // Remove "B " from the beginning
        }
        console.log("Index of " + name + " " + array.PlayerName.indexOf(name));
        nameIndex = array.PlayerName.indexOf(name);
        const offset = nameIndex - i;
        offsetArray.push(offset);
        i++;
    });

    array.Offset = offsetArray;
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
                if (eqID % 2 == 0) {
                    eqID = green_team.EquipmentID.indexOf(parseInt(eqID));
                    playerName = green_team.PlayerName[eqID];
                    offset = green_team.Offset[eqID];
                    setScore(greenTableId, eqID + offset, "base", 'whateves');
                    reorderRows(greenTableId, green_team);
                    addTextToScreen("Red Base Scored by " + playerName);
                }

            } else if (message.includes(":43")) {
                let [eqID, base] = message.split(':');
                    if (eqID % 2 != 0) {
                        eqID = red_team.EquipmentID.indexOf(parseInt(eqID));
                        playerName = red_team.PlayerName[eqID];
                        offset = red_team.Offset[eqID];
                        setScore(redTableId, eqID + offset, "base", 'whateves');
                        reorderRows(redTableId, red_team);
                        addTextToScreen("Green Base Scored by " + playerName);
                    }
            } else if (!(message.includes(":"))) {
                    addTextToScreen(message);
            } else {
                text = processHit(message);
                if (!text.includes(undefined)) {
                    addTextToScreen(text);
                    let [shooterIndex, hitIndex] = message.split(':');
                    if (shooterIndex == hitIndex) {
                        if (shooterIndex % 2 == 0) {
                            //get index of shooter
                            console.log("same Team");
                            shooterIndex = green_team.EquipmentID.indexOf(parseInt(shooterIndex));
                            playerName = green_team.PlayerName[shooterIndex];
                            offset = green_team.Offset[shooterIndex];
                            setScore(greenTableId, shooterIndex + offset, 'normal', "wasHit");
                            reorderRows(greenTableId, green_team);
                        } else {
                            shooterIndex = red_team.EquipmentID.indexOf(parseInt(shooterIndex));
                            offset = red_team.Offset[shooterIndex];
                            setScore(redTableId, shooterIndex + offset, 'normal', "wasHit");
                            reorderRows(redTableId, red_team);
                            playerName = red_team.PlayerName[shooterIndex];                      
                        }
                    } else {
                        if (shooterIndex % 2 == 0) {
                            //get index of shooter
                            shooterIndex = green_team.EquipmentID.indexOf(parseInt(shooterIndex));
                            playerName = green_team.PlayerName[shooterIndex];
                            offset = green_team.Offset[shooterIndex];
                            setScore(greenTableId, shooterIndex + offset, 'normal', "shooter");
                            reorderRows(greenTableId, green_team);
                        } else {
                            shooterIndex = red_team.EquipmentID.indexOf(parseInt(shooterIndex));
                            offset = red_team.Offset[shooterIndex];
                            setScore(redTableId, shooterIndex + offset, 'normal', "shooter");
                            reorderRows(redTableId, red_team);
                            playerName = red_team.PlayerName[shooterIndex];                       
                        }
    
                        if (hitIndex % 2 == 0) {
                            //get index of shooter
                            hitIndex = green_team.EquipmentID.indexOf(parseInt(hitIndex));
                            playerName = green_team.PlayerName[hitIndex];
                            offset = green_team.Offset[hitIndex];
                            setScore(greenTableId, hitIndex + offset, 'normal', "wasHit");
                            reorderRows(greenTableId, green_team);
                        } else {
                            hitIndex = red_team.EquipmentID.indexOf(parseInt(hitIndex));
                            offset = red_team.Offset[hitIndex];
                            setScore(redTableId, hitIndex + offset, 'normal', "wasHit");
                            reorderRows(redTableId, red_team);
                            playerName = red_team.PlayerName[hitIndex];                      
                        }
                    }

                }
                    
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
send_udp_message("4:4");
send_udp_message("1:1");
send_udp_message("3:3");


