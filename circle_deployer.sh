#!/bin/bash

echo 'stopping running server'
docker-compose stop

echo 'deploying mywell'
cd ~/mywell-server
git pull origin master
cd ~/mywell-server/mywell-ui
git pull origin master
#
# echo 'setting up ui'
# cd ~/mywell-server/mywell-ui/src
# npm install
# npm run setup-prod
# npm run babel

cd ~/mywell-server/
./run_server.sh production

exit
