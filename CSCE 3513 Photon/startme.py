import os
from dotenv import load_dotenv
load_dotenv()
from supabase import create_client, Client
import random
import string

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)


def generateID(length=15):
    """Generate a random ID consisting of letters (uppercase and lowercase) and numbers."""
    characters = string.ascii_letters + string.digits  # All letters (both cases) and numbers
    return ''.join(random.choice(characters) for _ in range(length))

def insert_player(playerName, id):
    randomID  = generateID()
    if playerName is not None:
        supabase.table("CurrentGameTable").insert({"id": randomID, "name": playerName, "equipment_id": int(id)}).execute()





def clear_table():
    supabase.table("CurrentGameTable").delete().neq('name', '0').execute()



from flask import Flask, render_template, request, json, jsonify, send_file
import udp_client as uc



app = Flask(__name__)








@app.route('/')
def display_image():
    return render_template('index.html')

@app.route('/play_photon')
def play_photon():
    return render_template('play_photon.html')

@app.route('/game')
def game():
    return render_template('game.html')

@app.route('/load_screen')
def load_screen():
    return render_template('load_screen.html')

@app.route('/get_image')
def get_image():
    return send_file('static/logo.jpg', mimetype='image/jpg')



@app.route('/play_photon/start_game', methods=['POST'])
def save_players():
    try:
        clear_table()
        # Get the player names from the request data
        data = request.get_json()
        playerNames = data.get('Player_Names', [])
        equipmentIds = data.get('Equipment_Ids', [])

        i = 0  # Initialize i outside the loop
        for name in playerNames:
            if name is not None:
                supabase.table("playerNameTable").insert({"name": name}).execute()
                insert_player(name, equipmentIds[i])
                uc.send_udp_message(name +  " Equipment: " + equipmentIds[i])
            i += 1  # Increment i within the loop
        

        # Optionally, you can send a response back to the client
        return jsonify({'message': 'Players saved successfully'}), 200
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': 'An error occurred'}), 500
    
   

@app.route('/get_data')
def get_red_data():
    # Execute a select query on the Supabase table corresponding to the 'team'
    response = supabase.table("CurrentGameTable").select('*').execute()
    print("response: ")
    print(response)
    # Convert the response data (model_dump_json) to a Python dictionary
    players = response.model_dump_json()
    # Return the players data as JSON
    return json.loads(players)




if __name__ == '__main__':
    app.run(debug=True, port=5000)
