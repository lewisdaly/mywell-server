#!/bin/bash

echo 'deploying mywell'
cd ~/mywell-server
git pull origin master

echo 'deployment finished. Tailing docker logs to be sure'
docker logs mywellserver_mywell-server_1 | tail -10
docker logs mywellserver_mywell-ui_1 | tail -10
docker logs mywellserver_db_1 | tail -10
