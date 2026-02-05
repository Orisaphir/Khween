#!/bin/bash
cd "$(dirname "$0")"
sudo chmod +x ./run.sh
sudo npm install
sudo node index.js