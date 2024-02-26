import socket


def onPlayerHit(transmitting_id, hit_id):
    # Send equipment ID of player who got hit (single int)
    clientMsg = f"{transmitting_id}:{hit_id}"
    serverAddress = ('127.0.0.1', 7501)  # Server address and port
    bytesToSend = str.encode(clientMsg)

    # Create client side socket
    udpClientSocket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)

    # Send equipment ID to the server
    udpClientSocket.sendto(bytesToSend, serverAddress)

    # Receive message back from server
    serverMsg, _ = udpClientSocket.recvfrom(1024)

    # Print received message
    print("Message from the server: {}".format(serverMsg.decode()))
    
#Create Player class to keep all the player relevant data
class Player:
    def __init__(self, id, codename, team, equipmentid):
        self.codename = codename
        self.equipmentid = equipmentid
        self.id = id
        self.team = team
        self.score = 0

#Create empty list to store player objects
player_list = []

#addPlayer function/Creates a new player object each time and adds it to the list
def addPlayer(playerid, playerCodename, playerTeam, playerEquipment):
    player_list.append(Player(playerid, playerCodename, playerTeam, playerEquipment))

# clientMsg = "hi"
# start = "202"
# end = "221"
# redBase = "53"
# greenBase = "43"
# serverAddress = 7501
# serverAddressPort = ("127.0.0.1", serverAddress)
# bytesToSend = str.encode(clientMsg)
# bufferSize = 1024

# #create client side socket
# udpClientSocket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)

# #send starter message to server from client
# udpClientSocket.sendto(bytesToSend, serverAddressPort)

# #receive message back from server
# serverMsg = udpClientSocket.recvfrom(bufferSize)

# #print recieved message
# print("message from the server {}".format(serverMsg[0]))


