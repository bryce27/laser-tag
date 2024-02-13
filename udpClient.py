import socket

clientMsg = "hi"
start = "202"
end = "221"
redBase = "53"
greenBase = "43"
serverAddress = 7501
serverAddressPort = ("127.0.0.1", serverAddress)
bytesToSend = str.encode(clientMsg)
bufferSize = 1024

#create client side socket
udpClientSocket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)

#send starter message to server from client
udpClientSocket.sendto(bytesToSend, serverAddressPort)

#receive message back from server
serverMsg = udpClientSocket.recvfrom(bufferSize)

#print recieved message
print("message from the server {}".format(serverMsg[0]))