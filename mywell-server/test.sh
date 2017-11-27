#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source $DIR/../env/envdevelopment.sh

if [ "$1" == "build" ]; then
  docker-compose -f docker-compose.test.yml build
fi


if [ "$1" == "run" ]; then
  docker-compose -f docker-compose.test.yml up
fi


echo 'running tests'
docker exec -it mywellserver_mywell-server_1 env TERM=xterm bash -c "npm test"
