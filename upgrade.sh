#!/bin/bash
docker-compose down
docker-compose up -f ../docker-compose.yml -d --force-recreate --build --scale bot=1
tail -f /srv/logs/newser_server/newser_server.txt
