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

def insert_player(tableName, playerName):
    if playerName is not None:
        randomID = generateID()
        supabase.table(tableName).insert({"id": randomID, "name": playerName}).execute()



def clear_table():
    supabase.table("Blue Team").delete().neq('id', 2).execute()
    supabase.table("Red Team").delete().neq('id', 1).execute()





from flask import Flask, render_template, request, json, jsonify, send_file
import subprocess
import udp_client as uc


app = Flask(__name__)

@app.route('/play_photon/submit', methods=['POST'])
@app.route('/play_photon/start_game', methods=['POST'])
def start_game():
    data = request.json
    transmitter_id = data.get('transmitter_id')
    hit_id = data.get('hit_id')

    # Call the UDP client to send the data
    uc.onPlayerHit(transmitter_id, hit_id)



    return jsonify({"message": "Game started successfully"})




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
        # Get the player names from the request data
        data = request.get_json()
        blue_players = data.get('bluePlayers', [])
        red_players = data.get('redPlayers', [])

        clear_table()

        for name in blue_players:
            insert_player("Blue Team", name)

        for name in red_players:
            insert_player("Red Team", name)            


        # Process the player names as needed
        print("Blue Team Players:", blue_players)
        print("Red Team Players:", red_players)

        response = supabase.table('Blue Team').select("*").execute()
        print(response)

        # Optionally, you can send a response back to the client
        return jsonify({'message': 'Players saved successfully'}), 200
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': 'An error occurred'}), 500

@app.route('/get_data')
def get_red_data():
    team= request.args.get('team')
    response = supabase.table(team).select('*').execute()
    print(response)
    players = response.model_dump_json()
    print(type(players))
    return json.loads(players)



if __name__ == '__main__':
    app.run(debug=True, port=5000)
