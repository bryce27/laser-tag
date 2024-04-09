import os
import time
from dotenv import load_dotenv
load_dotenv()
from supabase import create_client
import random
import string
import webbrowser

url = "https://xxsgrickhdpcxubeurjk.supabase.co"

key ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4c2dyaWNraGRwY3h1YmV1cmprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNDQ1NDUsImV4cCI6MjAyMjgyMDU0NX0.6RdisJLfJNX6FkK3dx3hR-Ust6A9EdaxCw851uphE7U"

supabase = create_client(url, key)




def generateID(length=15):
    """Generate a random ID consisting of letters (uppercase and lowercase) and numbers."""
    characters = string.ascii_letters + string.digits  # All letters (both cases) and numbers
    return ''.join(random.choice(characters) for _ in range(length))

def insert_player(playerName, playerID):
    if playerName != None:
        supabase.table("CurrentGameTable").insert({"name": playerName, "equipment_id": int(playerID)}).execute()





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

@app.route('/get_code_name', methods=['POST'])
def getCodeName():
        data = request.get_json()
        playerID = data.get('Player_ID', '')
        print("IDDDDDDD" + playerID)
        data = supabase.table("playerNameTable").select('*').eq('playerID', playerID).execute()
        if len(data.data) != 0:
            playerName = data.data[0]['name']
            print("NAME " + playerName)
            return playerName
        else:
            return "missing"
        
           
@app.route('/insertPlayerToDataBase', methods=['POST'])
def insertPlayerToDataBase():
    data = request.get_json()
    playerID = data.get('Player_ID', '')
    codeName=data.get('Code_Name', '')
    supabase.table("playerNameTable").insert({"playerID": playerID, "name": codeName}).execute()
    return '204'


@app.route('/play_photon/start_game', methods=['POST'])
def save_players():
    try:
        clear_table()
        # Get the player names and equipment IDs from the request data
        data = request.get_json()
        player_names = data.get('Player_Names', [])
        equipment_ids = data.get('Equipment_Ids', [])

        for i, id in enumerate(player_names):
            insert_player(id, equipment_ids[i])

        return '204'
 

    except Exception as e:
        print("Error:", e)
        return jsonify({'error': 'An error occurred'}), 500
    


    



@app.route('/get_data')
def get_red_data():
    # Execute a select query on the Supabase table corresponding to the 'team'
    response = supabase.table("CurrentGameTable").select('*').execute()

    players = response.data
    # Return the players data as JSON


    return json.dumps(players)


from flask import Response

@app.route('/send_udp_message', methods=['POST'])
def send_udp_message_route():
    print(request.json.get('message'))
    message = request.json.get('message')  # Get the parameter value from the request
    response_generator = uc.send_udp_message(message) 
     # Get the generator object
    print("RESPONSE    " + str(response_generator))
    return Response(response_generator, mimetype='text/event-stream')




if __name__ == '__main__':
    webbrowser.open('http://127.0.0.1:5000')
    app.run(debug=True, port=5000)
