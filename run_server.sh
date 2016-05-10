#!/bin/bash

if [ "$1" == "build" ]
then
  echo "building server"
  docker-compose build
  docker-compose pull
fi

if [ "$1" == "clear" ]
then
  echo "tearing down and rebuilding server!"
  docker-compose rm -fv
  docker-compose build
  docker-compose pull
fi

docker-compose up
