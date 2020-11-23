#!/bin/bash

cd newser_client
npm run build:dev

# docker build -t newser_client .
# docker tag newser_client 23792803/newser_client:development_$(date +'%d.%m.%Y')
# docker push 23792803/newser_client:development_$(date +'%d.%m.%Y')
# echo 'Succesfully build newser client'

cd ./../newser_server
docker build -t newser_server .
docker tag newser_server 23792803/newser_server:development_$(date +'%d.%m.%Y')
docker push 23792803/newser_server:development_$(date +'%d.%m.%Y')
echo 'Succesfully build newser server'

cd ./../newser_bot
docker build -t newser_bot .
docker tag newser_bot 23792803/newser_bot:development_$(date +'%d.%m.%Y')
docker push 23792803/newser_bot:development_$(date +'%d.%m.%Y')
echo 'Succesfully build newser bot'

cd ./../newser_mercury
docker build -t newser_mercury .
docker tag newser_mercury 23792803/newser_mercury:development_$(date +'%d.%m.%Y')
docker push 23792803/newser_mercury:development_$(date +'%d.%m.%Y')
echo 'Succesfully build newser mercury'

cd ./../