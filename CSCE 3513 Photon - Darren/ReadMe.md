Project Overview
This project aims to develop a Photon Laser Tag Game using Python Flask for the backend. The backend utilizes asynchronous methods and JSON for seamless communication with the frontend, which is implemented using JavaScript. Here's a concise summary of the project functionality:

Display Photon Logo: The game starts by displaying the Photon logo for 5 seconds.

Enter Player Names: After the logo display, users are prompted to enter player names for the red and blue teams. The system ensures that there are no duplicate names on the same or different teams.

Start Game: Once player names are entered, users can initiate the game by pressing the "Start Game" button. This action stores the names of the blue and red teams in the Supabase database.

Countdown Timer: A countdown timer appears, counting down from 3 seconds, and then displays "Start Game".

Scoreboard Display: After starting the game, users are presented with a scoreboard screen showing the scores for the red and blue teams. The scoreboard fetches names from the database.

By following this flow, players can enjoy an engaging and competitive laser tag game experience with seamless backend integration and a user-friendly frontend interface.