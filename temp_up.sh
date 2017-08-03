#!/usr/bin/env bash

source ./env/envlocal.sh


#just a little util to bring up part of the system to make development a bit faster

if [ "$1" == "build" ]
then
  echo "building server"
  docker-compose -f docker-compose.temp.yml build
fi


docker-compose -f docker-compose.temp.yml up
