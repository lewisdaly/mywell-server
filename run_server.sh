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
export ENABLE_LOGS=true
export VERSION_NUMBER=dev_1.3.1
export ENABLE_NOTIFICATIONS=false
export REFRESH_UI=false

if [ "$1" == "production" ]
then
  echo "running server in production mode"
  export VERSION_NUMBER=1.3.1
  export ENVIRONMENT=production
  export ENABLE_NOTIFICATIONS=true
  export REFRESH_UI=true
  docker-compose up -d
  exit 0
fi

docker-compose up
