import socket

def start_udp_server():
    Server_IP = "127.0.0.1"
    Server_Port = 7501
    ServerSocket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
    ServerSocket.bind((Server_IP, Server_Port))

    print("UDP Server is up and running")

    while True:
        message, _ = ServerSocket.recvfrom(1024)
        message = message.decode()
        print(f"Received message: {message}")

if __name__ == "__main__":
    start_udp_server()
