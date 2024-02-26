import socket

# Helper functions here
def onReceiveData(data):
    # Parse the received data to extract player IDs
    player_transmitting, player_hit = map(int, data.split(':'))
    
    # Here you can handle the received data
    print(f"Player transmitting: {player_transmitting}, Player hit: {player_hit}")

    # Example logic: Assuming the player who got hit is transmitting
    return player_hit  # Return the player ID that was hit

def isPlayerOnOwnTeam(playerOneId, playerTwoId):
    pass
    return False

def teamScored(team):
    pass
    
codes = {
    53: teamScored('red'),
    43: teamScored('green'),
}

#create IP & Port
Server_IP = "127.0.0.1"
Server_Port = 7501
Client_Port = 7500
serverMsg = "Hi Client"
bytestoSend = str.encode(serverMsg)

#create socket
ServerSocket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)

#bind IP and port
ServerSocket.bind((Server_IP, Server_Port))

print("This server is up and running")

while (True):
    #put message in clientMessage, put address in clientAddr, size of buffer is 1024 
    bytesAddressPair = ServerSocket.recvfrom(1024)
    message = bytesAddressPair[0].decode()
    address = bytesAddressPair[1]
    clientIP = "IP:{}".format(address)

    print(f"Received message from {clientIP}: {message}")

    # Handle received data
    hit_player_id = onReceiveData(message)

    # Send back data (acknowledgement)
    ServerSocket.sendto(str(hit_player_id).encode(), address)