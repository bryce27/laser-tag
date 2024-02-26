let red_team = [];
let blue_team = [];

function get_data(team) {
    return fetch(team)
        .then(response => response.json())
        .then(data => {
            const team_array = [];
            data.data.forEach(function(item) {
                team_array.push(item.name);
            });
            return team_array; // Return the populated team_array
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            throw error; // Re-throw the error to propagate it
        });
}

Promise.all([
    get_data('get_data?team=Red%20Team'),
    get_data('get_data?team=Blue%20Team')
])
.then(([red_data, blue_data]) => {
    red_team = red_data; // Assign the resolved data to red_team
    blue_team = blue_data; // Assign the resolved data to blue_team
    console.log("Red team:", red_team);
    console.log("Blue team:", blue_team);
    console.log("First player in blue team:", blue_team[0]);
    populate_scoreBoard(blue_team, '#table1')
    populate_scoreBoard(red_team, '#table2')
})
.catch(error => console.error('Error fetching data for both teams:', error));






function populate_scoreBoard(player_name_array, table_id) {
    // Get a reference to the table body
        console.log(player_name_array[0]);
        player_name_array.forEach(obj => {
            console.log("NAME" + obj);
            const tableBody = document.querySelector(`${table_id} tbody`);

            // Create a new table row
            const newRow = document.createElement('tr');

            // Create new table data cells for player, name, and score
            const playerCell = document.createElement('td');
            const playerImage = document.createElement('img');
            playerImage.src = blueTeamImageUrl;
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



