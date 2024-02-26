import socket

def send_udp_message(message):
    Client_IP = "127.0.0.1"
    Client_Port = 7500
    ClientSocket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
    ClientSocket.bind((Client_IP, Client_Port))

    print("UDP Client is up and running")

    # Send message to server
    Server_Address = ("127.0.0.1", 7501)
    ClientSocket.sendto(message.encode(), Server_Address)







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



# start = "202"
# end = "221"
# redBase = "53"
# greenBase = "43"
# serverAddress = 7501
# serverAddressPort = ("127.0.0.1", serverAddress)
# bytesToSend = str.encode(clientMsg)
# bufferSize = 1024