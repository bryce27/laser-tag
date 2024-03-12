#!/bin/bash
set -e
python3 startme.py &
python3 udp_server.py &
open http://127.0.0.1:5000/
echo "Done"