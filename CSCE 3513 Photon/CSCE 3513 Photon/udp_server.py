import random
import socket
import time

def server():
    server_address = ('127.0.0.1', 12345)
    buffer_size = 1024

    # Create a UDP socket
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    server_socket.bind(server_address)

    print("Server is listening...")

    while True:
        # Receive data from the client
        received_data, client_address = server_socket.recvfrom(buffer_size)
        print(f"Received message from {client_address}: {received_data.decode()}")
        # Send a response back to the client
       

        redPlayer1 = '1'
        redPlayer2 = '3'
        greenPlayer1 = '2'
        greenPlayer2 = '4'
        count = 0
        if received_data.decode() == '202':
            print("Lets start the Game")
            while count < 10:
                print(count)
                if random.randint(1, 2) == 1:
                    redplayer = 1
                else:
                    redplayer = 3

                if random.randint(1, 2) == 1:
                    greenplayer = 2
                else:
                    greenplayer = 4

                if random.randint(1, 2) == 1:
                    message = str(redplayer) + ":" + str(greenplayer)
                else:
                    message = str(greenplayer) + ":" + str(redplayer)
             
                server_socket.sendto(message.encode(), client_address)
                count+1
                time.sleep(random.randint(1, 3))
        else:
            message = "Nothing Important"
            server_socket.sendto(message.encode(), client_address)
                



if __name__ == "__main__":
    server()
