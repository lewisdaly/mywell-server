#!/bin/bash

echo 'Make sure you are logged in, with docker login'
#Get the dir 1 level up
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

source $DIR/../env/env$STAGE.sh

IMAGE_TAG="dev_$VERSION_NUMBER"

function mywell-server() {
  docker tag mywell-server:local lewisdaly/mywell-server:"$IMAGE_TAG"
  docker push lewisdaly/mywell-server:"$IMAGE_TAG"
}

function mywell-ui() {
  docker tag mywell-ui:local lewisdaly/mywell-ui:"$IMAGE_TAG"
  docker push lewisdaly/mywell-ui:"$IMAGE_TAG"
}

#TODO: add utils, console...

cd $DIR/../
case $1 in
  all)
    docker-compose build
    mywell-server
    mywell-ui
    ;;
  mywell-server)
    docker-compose build mywell-server
    mywell-server
    ;;
  mywell-ui)
    docker-compose build mywell-ui
    mywell-ui
    ;;
  *)
    echo "usage: $@ {all, mywell-server, mywell-ui}"
    exit 1
    ;;
esac
