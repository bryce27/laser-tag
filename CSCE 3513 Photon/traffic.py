import socket
import random
import time

bufferSize = 1024
serverAddressPort = ("127.0.0.1", 7500)
clientAddressPort = ("127.0.0.1", 7501)

print('This program will generate some test traffic for 2 players on the red team as well as 2 players on the green team\n')

# red1 = input('Enter equipment id of red player 1 ==> ')
# red2 = input('Enter equipment id of red player 2 ==> ')
# green1 = input('Enter equipment id of green player 1 ==> ')
# green2 = input('Enter equipment id of green player 2 ==> ')

# Create datagram sockets
UDPServerSocketReceive = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
UDPClientSocketTransmit = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)

# bind server socket
UDPServerSocketReceive.bind(serverAddressPort)

# Wait for start from game software
print("\nWaiting for start from game software...\n")

while True:
    received_data = ' '
    while received_data != '202':

        received_data, address = UDPServerSocketReceive.recvfrom(bufferSize)
        received_data = received_data.decode()
        message = "SERVER HEYYYYYY"
        try:
            # Send message to server
            UDPClientSocketTransmit.sendto(message.encode(), clientAddressPort)
            print("Message sent to server:", message)

            # Receive response from server
            response, _ = UDPClientSocketTransmit.recvfrom(1024)
            print("Received from server:", response.decode())
        except Exception as e:
            print("Error:", e)
        print("Received from game software: " + received_data)
    print('')

    # Create events, random player and order
    # counter = 0

    # while True:
    #     # print(counter)
    #     # if random.randint(1, 2) == 1:
    #     #     redplayer = red1
    #     # else:
    #     #     redplayer = red2

    #     # if random.randint(1, 2) == 1:
    #     #     greenplayer = green1
    #     # else:
    #     #     greenplayer = green2

    #     # if random.randint(1, 2) == 1:
    #     #     message = str(redplayer) + ":" + str(greenplayer)
    #     # else:
    #     #     message = str(greenplayer) + ":" + str(redplayer)

    #     # # After 10 iterations, send base hit
    #     # if counter == 10:
    #     #     message = str(redplayer) + ":43"
    #     # if counter == 20:
    #     #     message = str(greenplayer) + ":53"

    #     print("Transmitting to game: " + message)

    #     try:
    #         # Send message to server
    #         UDPClientSocketTransmit.sendto(message.encode(), clientAddressPort)
    #         print("Message sent to server:", message)

    #         # Receive response from server
    #         response, _ = UDPClientSocketTransmit.recvfrom(1024)
    #         print("Received from server:", response.decode())
    #     except Exception as e:
    #         print("Error:", e)
            
        
    #     # Receive answer from game software
    #     received_data, address = UDPServerSocketReceive.recvfrom(bufferSize)
    #     received_data = received_data.decode('utf-8')
    #     print("Received from game software: " + received_data)
    #     print('')
    #     counter += 1

    #     if received_data == '221':
    #         break

    #    # time.sleep(random.randint(1, 3))  # Introduce delay between transmissions

    # print("Restarting the traffic generation loop...\n")
