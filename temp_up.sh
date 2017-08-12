#!/usr/bin/env bash

source ./env/envlocal.sh

COMPOSE_FILE=docker-compose.ui.yml


#just a little util to bring up part of the system to make development a bit faster

if [ "$1" == "build" ]
then
  echo "building server"
  docker-compose -f "$COMPOSE_FILE" build
fi

docker-compose -f "$COMPOSE_FILE" up
