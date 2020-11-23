#!/bin/bash

function dev {
    ./build/build.development.sh
    docker-compose pull
    docker-compose up -d --scale bot=5 --scale mercury=2
    tail -f /srv/logs/newser_server/newser_server.txt
}

function stag {
    ./build/build.staging.sh
}

function prod {
    ./build/build.production.sh
}

function main {
    echo "Введите стадию сборки (development, staging, production)"
    read stad

    case $stad in
    development) dev;;
    staging) stag;;
    production) prod;;
    esac
}

./togit.sh
main