import socket

#create IP & Port
Server_IP = "127.0.0.1"
Server_Port = 7501

#create socket
ServerSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

#bind IP and port
ServerSocket.bind((Server_IP, Server_Port))

while (True):
    #put message in clientMessage, put address in clientAddr, size of buffer is 1024 
    clientMessage, clientAddr = ServerSocket.recvfrom(1024)
    
    #---!!!EDIT LATER -- MAKE FUNCTION FOR PLAYER TRANSMITTING!!!---
    playerTransmitting = 999;
    #---!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!---
    
    #Combine message for sending back
    serverMessage = (playerTransmitting, clientMessage)

    #send back data
    ServerSocket.sendto(serverMessage, clientAddr)