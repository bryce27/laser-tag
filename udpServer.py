import socket

# Helper functions here
def onReceiveData(playerOneId, playerTwoId):
    # 2 integers: equipment id of player transmitting : equipment id of player hit
    pass
    return 1 # equipment id (integer) of player that was hit

def isPlayerOnOwnTeam(playerOneId, playerTwoId):
    pass
    return False
    
codes = {
    53: onReceiveData,
    43: isPlayerOnOwnTeam
}

# TODO:
# if player is not on own team, give them 100 points
# also put B next to their name

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
    message = bytesAddressPair[0]
    address = bytesAddressPair[1]
    clientMsg = "Client msg:{}".format(message)
    clientIP = "IP:{}".format(address)
    
    print(clientMsg)
    print(clientIP)

    #---!!!EDIT LATER -- MAKE FUNCTION FOR PLAYER TRANSMITTING!!!---
    playerTransmitting = "999"
    #---!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!---
    
    #Combine message for sending back

    #send back data
    ServerSocket.sendto(bytestoSend, address)
