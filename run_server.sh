#!/bin/bash

source ./env/envlocal.sh

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


if [ "$1" == "production" ]
then
  echo "running server in production mode"
  docker-compose up -d
  exit 0
fi

docker-compose up mywell-server db
