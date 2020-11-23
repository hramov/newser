#!/bin/bash
cd ./newser_server
git add .
git commit -m "Auto commit $(date +'%d.%m.%Y')"
git push origin master

cd ./../newser_bot
git add .
git commit -m "Auto commit $(date +'%d.%m.%Y')"
git push origin master

cd ./../newser_mercury
git add .
git commit -m "Auto commit $(date +'%d.%m.%Y')"
git push origin master

cd ./../newser_client
git add .
git commit -m "Auto commit $(date +'%d.%m.%Y')"
git push origin master

cd ./../newser_telegram
git add .
git commit -m "Auto commit $(date +'%d.%m.%Y')"
git push origin master