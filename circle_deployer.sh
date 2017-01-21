#!/bin/bash

echo 'deploying mywell'
cd ~/mywell-server
git pull origin master
cd ~/mywell-server/mywell-ui
git pull origin master

#make sure that we have switched the right env variables
cd ~/mywell-server/mywell-ui/ionic_rainapp
npm run setup-prod

echo 'deployment finished. Tailing docker logs to be sure'
docker logs mywellserver_mywell-server_1 | tail -10
docker logs mywellserver_mywell-ui_1 | tail -10
docker logs mywellserver_db_1 | tail -10
