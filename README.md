## Setup

1. **Download the Game**: Download the Laser Tag Game from the repository.

2. **Clone the Repository**: After downloading, clone this repository to your local machine.

3. **Install Dependencies**: Ensure that you have Python and PostgreSQL installed on your system. Then, install the required dependencies using pip:
   - supabase
   - python-dotenv
   - Flask
   - webbrowser
   - For Linux Ubuntu users using a virtual machine: Run `pip install --upgrade gotrue` 

## Running the Game

1. **Start `udp_server.py`**: Open a terminal window, navigate to the root directory of the cloned repository, and run the following command for Linux Users:
    ```bash
    python3 udp_server.py
    ```
Run the following command for Window Users:
     ```bash
    py udp_server.py
    ```
   This script simulates runs the UDP Server required for Photon Laser Tag.
2. **Run `startme.py`**: In a separate terminal window, navigate to the root directory of the cloned repository, and run the following command for Linux Users:
    ```bash
    python3 startme.py
    ```
Run the following command for Window Users:
     ```bash
    py startme.py
    ```
   This script launches the game interface.

3. **Access the Game**: A web browser will automatically launch and navigate to http://127.0.0.1:5000/ to access the game interface.

4. **Enter Player Information**: In the web interface, enter player Ids and equipment Ids. Finally, click "Start Game" to initiate a count-down timer to begin the game. Clicking "Clear Entries" will clear all entries.

5. **Gameplay**: Once the game starts, the scoreboard will display the score. Clicking "Generate Gameplay" will simulate gameplay. 

6. **End Game**: After finishing the game, you can click "Return to Player Entry" to start a new game.

## Team 18 Members
- Blake (GitHub: Blake-wood)
- Bryce (GitHub: bryce27)
- Cameron (GitHub: cameronevans26)
- Darian (GitHub: williamsdarian)
- Darren (GitHub: darrenb314)
- Gianfranco (GitHub: gb016)
- Jameson (GitHub: JamesonThomas-edu)

## Real Names and GitHub Name Reference Guide
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
