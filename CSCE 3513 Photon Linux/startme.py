import os
from dotenv import load_dotenv
load_dotenv()
from supabase_py import create_client
import random
import string

url = "https://xxsgrickhdpcxubeurjk.supabase.co"

key ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4c2dyaWNraGRwY3h1YmV1cmprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNDQ1NDUsImV4cCI6MjAyMjgyMDU0NX0.6RdisJLfJNX6FkK3dx3hR-Ust6A9EdaxCw851uphE7U"

supabase = create_client(url, key)





def generateID(length=15):
    """Generate a random ID consisting of letters (uppercase and lowercase) and numbers."""
    characters = string.ascii_letters + string.digits  # All letters (both cases) and numbers
    return ''.join(random.choice(characters) for _ in range(length))

def insert_player(playerName, playerID):
    try:
        supabase.table("CurrentGameTable").insert({"name": playerName, "equipment_id": int(playerID)}).execute()
        print("Insertion successful")
    except Exception as e:
        print("Error:", e)





def clear_table():
    supabase.table("CurrentGameTable").delete().neq('name', '0').execute()
    #supabase.table("playerNameTable").delete().neq("name", "hey").execute()




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
        print("hey1")
        try:
            # Check if the table isn't empty
            table_data = supabase.table("CurrentGameTable").select('*').execute()
            if table_data and table_data['data']:
                # Delete rows from CurrentGameTable if it isn't empty
                supabase.table("CurrentGameTable").delete().neq('name', '0').execute()
                print("Deletion of rows from CurrentGameTable completed successfully.")
            else:
                print("CurrentGameTable is empty. No rows to delete.")
        except Exception as e:
            print("Error:", e)
        print("hey2")
        # Get the player names and equipment IDs from the request data
        data = request.get_json()
        print("hey3")
        player_names = data.get('Player_Names', [])
        equipment_ids = data.get('Equipment_Ids', [])
        print("PLAYERSSS " + str(player_names))

        # Initialize a list to store IDs not found in the database
        missing_ids = []
        missing_equipment = []

        for i, id in enumerate(player_names):
            # Check if the player ID exists in the database
            data = supabase.table("playerNameTable").select('*').eq('playerID', id).execute()
            print(data['data'])
            if len(data['data']) != 0:
                # If player exists, insert the player
                #uc.send_udp_message(data.data[0]['name'] +  " Equipment: " + equipment_ids[i])
                print("NAME " + data['data'][0]['name'])
                insert_player(data['data'][0]['name'], equipment_ids[i])
            else:
                print("MADE IT HERE 2")
                # If player doesn't exist, add the ID to missing IDs list
                missing_ids.append(id)
                missing_equipment.append(equipment_ids[i])
                #supabase.table("playerNameTable").insert({"playerID": id}).execute()
        
        # Optionally, you can send a response back to the client with missing IDs
        if missing_ids:
            return jsonify({'missing_ids': missing_ids, 'missing_equipment': missing_equipment}), 200
        else:
            return jsonify({'message': 'Players saved successfully'}), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({'error': 'An error occurred'}), 500
    
@app.route('/handle_missing_names', methods=['POST'])
def handle_missing_players():
    try:
        print("HEREEEEEE")
        # Get the player names and equipment IDs from the request data
        data = request.get_json()
        player_names = data.get('Player_Names', [])
        equipment_ids = data.get('Equipment_Ids', [])
        player_ids = data.get('Player_Ids', [])
        
        for i, (name, plID, eqID) in enumerate(zip(player_names, player_ids, equipment_ids)):
            # Check if the player ID exists in the database
            print("NAMEEEEEEEEEEEEEEEEEEE")
            insert_player(name, eqID)
            supabase.table("playerNameTable").insert({"playerID": plID, "name": name}).execute()
           # uc.send_udp_message(name +  " Equipment: " + eqID)
            

        return jsonify({'message': 'Players saved successfully'}), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({'error': 'An error occurred'}), 500

    



@app.route('/get_data')
def get_red_data():
    # Execute a select query on the Supabase table corresponding to the 'team'
    response = supabase.table("CurrentGameTable").select('*').execute()

    players = response
    # Return the players data as JSON

    return json.dumps(players)


from flask import Response

@app.route('/send_udp_message', methods=['POST'])
def send_udp_message_route():
    message = request.json.get('message')  # Get the parameter value from the request
    response_generator = uc.send_udp_message(message)  # Get the generator object
    print("RESPONSE    " + str(response_generator))
    return Response(response_generator, mimetype='text/event-stream')




if __name__ == '__main__':
    app.run(debug=True, port=5000)
