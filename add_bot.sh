#!/bin/bash
docker-compose down
let bot_scale=$1
docker-compose up -d --scale bot=$bot_scale
