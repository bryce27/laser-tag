import socket
import time

def send_udp_message(message):
    server_address = ('127.0.0.1', 12345)
    buffer_size = 1024

    # Create a UDP socket
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    count = 0
    while True:
        # Send data to the server
        client_socket.sendto(message.encode(), server_address)

        # Receive response from the server
        data, _ = client_socket.recvfrom(buffer_size)
        print("Received response from server:", data.decode())

        break

        # Sleep for a while before sending the next message
        time.sleep(1)

    










# start = "202"
# end = "221"
# redBase = "53"
# greenBase = "43"
# serverAddress = 7501
# serverAddressPort = ("127.0.0.1", serverAddress)
# bytesToSend = str.encode(clientMsg)
# bufferSize = 1024