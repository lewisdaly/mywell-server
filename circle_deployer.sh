#!/bin/bash

echo 'stopping running server'
docker-compose stop

echo 'deploying mywell'
cd ~/mywell-server
git pull origin master
cd ~/mywell-server/mywell-ui
git pull origin master

echo 'setting up ui'
cd ~/mywell-server/mywell-ui/src
npm install
npm run setup-prod
npm run babel


cd ~/mywell-server/
./run_server.sh production
#make sure that we have switched the right env variables
# cd ~/mywell-server/mywell-ui/src
# npm run setup-prod

# in /mywell-ui/src/:


echo 'deployment finished. Tailing docker logs to be sure'
docker logs mywellserver_mywell-server_1 | tail -10
docker logs mywellserver_mywell-ui_1 | tail -10
docker logs mywellserver_db_1 | tail -10
