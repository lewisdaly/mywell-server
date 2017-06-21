#!/usr/bin/env bash

if [ "$HOME" == "/root" ]; then
  echo 'Looks like you might be in a docker container. This script will not work within a docker container. Sorry'
  exit 1
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source $DIR/../../env/env$STAGE.sh

echo 'Make sure you are logged in, with docker login'

# TODO: we could make this more complicated, but for now use the IMAGE_SUFFIX
IMAGE_TAG="${IMAGE_SUFFIX}"

function mywell-server() {
  docker tag mywell-server:local lewisdaly/mywell-server:"$IMAGE_TAG"
  docker push lewisdaly/mywell-server:"$IMAGE_TAG"
}

function mywell-ui() {
  docker tag mywell-ui:local lewisdaly/mywell-ui:"$IMAGE_TAG"
  docker push lewisdaly/mywell-ui:"$IMAGE_TAG"
}

function mywell-utils() {
  docker tag mywell-utils:latest lewisdaly/mywell-utils:"$IMAGE_TAG"
  docker push lewisdaly/mywell-utils:"$IMAGE_TAG"
}

#TODO: add utils, console...

cd $DIR/../
case $1 in
  skip-build)
    echo "warning: not building anything"
    mywell-server
    mywell-ui
    mywell-utils
    ;;
  all)
    docker-compose build
    mywell-server
    mywell-ui
    mywell-utils
    ;;
  mywell-server)
    docker-compose build mywell-server
    mywell-server
    ;;
  mywell-ui)
    docker-compose build mywell-ui
    mywell-ui
    ;;
  mywell-utils)
    cd $DIR/../../mywell-utils
    docker build . -t mywell-utils
    mywell-utils
    ;;
  *)
    echo "usage: $@ {all, mywell-server, mywell-ui, mywell-utils}"
    exit 1
    ;;
esac
