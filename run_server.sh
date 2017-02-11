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

if [ "$1" == "test" ]
then
  echo "starting server in test mode!"
  docker-compose -f docker-compose.yml  -f docker-compose.test.yml up
fi


# start the production server
# if [ "$1" == "prod" ]
# then
#   cd ./mywell-ui;
#   npm run prod;
#   cd ..;
#   && docker-compose up
# fi


docker-compose up
