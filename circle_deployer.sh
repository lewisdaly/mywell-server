#!/bin/bash

echo 'stopping running server'
docker-compose stop

echo 'deploying mywell'
cd ~/mywell-server
git pull origin master
cd ~/mywell-server/mywell-ui
git stash
git pull origin master

cd ~/mywell-server/
./run_server.sh production

exit
