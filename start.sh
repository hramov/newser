#!/bin/bash
docker-compose down
docker-compose pull
docker-compose up -d --scale bot=10
tail -f /srv/logs/newser_server/newser_server.txt
