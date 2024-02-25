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
    randomID = generateID()
    supabase.table(tableName).insert({"id": randomID, "name": playerName}).execute()

#insert_player("Red Team", "General OSO")
#insert_player("Blue Team", "Bruce Lee")

response = supabase.table('Red Team').select("*").execute()
print(response)
response = supabase.table('Blue Team').select("*").execute()
print(response)
print(response)


from flask import Flask, render_template, request, jsonify, Blueprint

app2_bp = Blueprint('app2', __name__)

@app2_bp.route('/')
def home():
    return render_template('play_photon.html')



@app2_bp.route('/play_photon/save_players', methods=['POST'])
def save_players():
    try:
        # Get the player names from the request data
        data = request.get_json()
        blue_players = data.get('bluePlayers', [])
        red_players = data.get('redPlayers', [])

        # Process the player names as needed
        print("Blue Team Players:", blue_players)
        print("Red Team Players:", red_players)

        # Optionally, you can send a response back to the client
        return jsonify({'message': 'Players saved successfully'}), 200
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': 'An error occurred'}), 500

app = Flask(__name__)
app.register_blueprint(app2_bp)
if __name__ == '__main__':
    app.run(debug=True, port=5000)
