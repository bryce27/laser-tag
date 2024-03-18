import socket

def send_udp_message(message):
    server_address = ('127.0.0.1', 7500)
    buffer_size = 1024

    # Create a UDP socket
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    # Send data to the server
    client_socket.sendto(message.encode(), server_address)

    messageArray = []
    # Receive response from the server
    while True:
        data, _ = client_socket.recvfrom(buffer_size)
        yield data.decode()
        # messageArray.append(data.decode())
        print("Received response from server:", data.decode())
        # if (data.decode() == '221'):
        #     break

    # return messageArray

    


    








# start = "202"
# end = "221"
# redBase = "53"
# greenBase = "43"
# serverAddress = 7501
# serverAddressPort = ("127.0.0.1", serverAddress)
# bytesToSend = str.encode(clientMsg)
# bufferSize = 1024