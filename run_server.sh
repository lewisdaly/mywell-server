#!/bin/bash

source /tmp/mywell_env

# if [ "$1" == "clear" ]
# then
#   echo "tearing down and rebuilding server!"
#   docker-compose rm -fv
#   cd mywell-server
#   npm install
#   cd ..
#   docker-compose build
#   docker-compose pull
# fi

if [ "$INTERACTIVE_DOCKER" == "true" ]
then
  echo "running servers in headless mode"
  docker-compose up -d
  exit 0
fi


docker-compose up
