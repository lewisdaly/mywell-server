#!/bin/bash

if [ "$1" == "build" ]
then
  echo "building server"
  cd mywell-server
  npm install
  cd ..
  docker-compose build
  docker-compose pull
fi

if [ "$1" == "clear" ]
then
  echo "tearing down and rebuilding server!"
  docker-compose rm -fv
  cd mywell-server
  npm install
  cd ..
  docker-compose build
  docker-compose pull
fi

export ENVIRONMENT=development

#We don't use this anymore! refer to mywell-server/test
# if [ "$1" == "test" ]
# then
#   echo "starting server in test mode!"
#   export ENVIRONMENT=test
#   docker-compose -f docker-compose.yml -f docker-compose.test.yml build
#   docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d
#
# fi


if [ "$1" == "production" ]
then
  echo "running server in production mode"
  export ENVIRONMENT=production
fi


docker-compose up
