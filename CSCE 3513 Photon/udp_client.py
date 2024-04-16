import socket

def send_udp_message(message):
    server_address = ('127.0.0.1', 7500)
    buffer_size = 1024

    # Create a UDP socket
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    # Set a timeout for receiving response
    client_socket.settimeout(5)  

    try:
        # Send data to the server
        client_socket.sendto(message.encode(), server_address)
        # Receive response from the server
        data, _ = client_socket.recvfrom(buffer_size)
        response = data.decode()
        print("Received response from server:", response)
        return response
    except Exception as e:
        print("Error sending or receiving UDP message:", e)
        return None
    finally:
        client_socket.close()
