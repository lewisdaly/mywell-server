#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source $DIR/../env/envdevelopment.sh

if [ "$1" == "build" ]; then
  docker-compose -f docker-compose.test.yml build

  exit 0
fi


if [ "$1" == "run" ]; then
  #A little hacky, but perhaps it will work
  docker rm -f mywellserver_test_db_1
  docker-compose -f docker-compose.test.yml up
  exit 0
fi


echo 'running tests'
docker exec -it mywellserver_mywell-server_1 env TERM=xterm bash -c "npm test"
