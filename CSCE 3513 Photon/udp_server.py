import random
import socket
import time

def server():
    server_address = ('127.0.0.1', 7500)
    buffer_size = 1024

    # Create a UDP socket
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    server_socket.bind(server_address)

    redPlayer1 = input('Enter equipment id of red player 1 ==> ')
    redPlayer2 = input('Enter equipment id of red player 2 ==> ')
    greenPlayer1 = input('Enter equipment id of green player 1 ==> ')
    greenPlayer2 = input('Enter equipment id of green player 2 ==> ')

    print ("")
    print ("waiting for start from game_software")



    while True:
        # Receive data from the client
        received_data, client_address = server_socket.recvfrom(buffer_size)
        print(f"Received message from {client_address}: {received_data.decode()}")
        # Send a response back to the client


        count = 0
        if received_data.decode() == '202':
            message = "Start Game"
            server_socket.sendto(message.encode(), client_address)
            time.sleep(1)
            print("Lets start the Game")
            while count < 5:
                if random.randint(1, 2) == 1:
                    redplayer = redPlayer1
                else:
                    redplayer = redPlayer2

                if random.randint(1, 2) == 1:
                    greenplayer = greenPlayer1
                else:
                    greenplayer = greenPlayer2

                if random.randint(1, 2) == 1:
                    message = str(redplayer) + ":" + str(greenplayer)
                else:
                    message = str(greenplayer) + ":" + str(redplayer)

                if count == 2:
                    message = str(redplayer) + ':43'
                if count == 3:
                    message = str(greenplayer) + ':53'

                print("MESSAGEEE" + message)
             
                server_socket.sendto(message.encode(), client_address)
                count = count + 1
                time.sleep(1)

                
        if received_data.decode() == '221':
             message = "Game is Over"
             server_socket.sendto(message.encode(), client_address)
             print("END GAME")
             break
        
        if ':' in received_data.decode():
             message = received_data.decode()
             server_socket.sendto(message.encode(), client_address)
             
        
  
                



if __name__ == "__main__":
    server()
