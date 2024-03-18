## Setup

1. **Choose the Correct Version**: Depending on your operating system, download the appropriate version of the Laser Tag Game: 
   - For Linux Ubuntu users: Download 'CSCE 3513 Photon Linux'
   - For Windows or macOS users: Download 'CSCE 3513 Photon'

2. **Clone the Repository**: After downloading, clone this repository to your local machine.

3. **Install Dependencies**: Ensure that you have Python and PostgreSQL installed on your system. Then, install the required dependencies using pip:
   - For Linux Ubuntu users: supabase_py, python-dotenv, Flask
   - For Windows or macOS users: supabase, python-dotenv, Flask

## Running the Game

1. **Start `udp_server.py`**: Open a terminal window, navigate to the root directory of the cloned repository, and run the following command to start the UDP server depending on the operating system:
    ```bash
    python3 udp_server.py
    ```
    ```bash
    py udp_server.py
    ```
   This script simulates traffic between four players: 2 red and 2 green. The server will prompt you to enter four equipment IDs. Enter 1 and 3 for the red players, and 2 and 4 for the green players.

2. **Run `startme.py`**: In a separate terminal window, navigate to the root directory of the cloned repository, and run the following command to start the Flask application depending on the operating system:
    ```bash
    python3 startme.py
    ```
    ```bash
    py startme.py
    ```
   This script launches the game interface.

3. **Access the Game**: Open a web browser and navigate to http://127.0.0.1:5000/ to access the game interface.

4. **Enter Player Information**: In the web interface, enter the player IDs for all four players in the designated column. Then, enter the corresponding equipment IDs (1, 2, 3, and 4) that you previously entered when prompted by `udp_server.py`. Finally, click "Start Game" to initiate a count-down timer to initiate the game. Clicking F12 will clear all entries.

5. **Gameplay**: Once the game starts, the scoreboard will display the score.

6. **End Game**: After finishing the game, you can close the browser window to end the session.

## Team 18 Members
- Blake (GitHub: Blake-wood)
- Bryce (GitHub: bryce27)
- Cameron (GitHub: cameronevans26)
- Darian (GitHub: williamsdarian)
- Darren (GitHub: darrenb314)
- Gianfranco (GitHub: gb016)
- Jameson (GitHub: JamesonThomas-edu)

## Real Names and Github Name Reference Guide
| Real Name | GitHub Name        |
| --------- | ------------------ |
| Blake     | Blake-wood         |
| Bryce     | bryce27            |
| Cameron   | cameronevans26     |
| Darian    | williamsdarian     |
| Darren    | darrenb314         |
| Gianfranco| gb016              |
| Jameson   | JamesonThomas-edu  |

Enjoy playing Laser Tag!
