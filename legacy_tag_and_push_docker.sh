#!/usr/bin/env bash

if [ "$HOME" == "/root" ]; then
  echo 'Looks like you might be in a docker container. This script will not work within a docker container. Sorry'
  exit 1
fi


# TODO: we could make this more complicated, but for now use the IMAGE_SUFFIX
# IMAGE_TAG="${VERSION_NUMBER}_${TRAVIS_BUILD_NUMBER}"
IMAGE_TAG="latest"
REPO_NAME="ldaly"

function mywell-server() {
  docker tag mywell-server:local $REPO_NAME/mywell-server:"$IMAGE_TAG"
  echo "Pushing $REPO_NAME/mywell-server:"$IMAGE_TAG""
  docker push $REPO_NAME/mywell-server:"$IMAGE_TAG"
}

function mywell-ui() {
  docker tag mywell-ui:local $REPO_NAME/mywell-ui:"$IMAGE_TAG"
  echo "Pushing $REPO_NAME/mywell-ui:"$IMAGE_TAG""
  docker push $REPO_NAME/mywell-ui:"$IMAGE_TAG"
}

function mywell-utils() {
  docker tag mywell-utils:local $REPO_NAME/mywell-utils:"$IMAGE_TAG"
  echo "Pushing $REPO_NAME/mywell-utils:"$IMAGE_TAG""
  docker push $REPO_NAME/mywell-utils:"$IMAGE_TAG"
}

function mywell-gql() {
  docker tag mywell-gql:local $REPO_NAME/mywell-gql:"$IMAGE_TAG"
  echo "Pushing $REPO_NAME/mywell-gql:"$IMAGE_TAG""
  docker push $REPO_NAME/mywell-gql:"$IMAGE_TAG"
}


case $1 in
  skip-build)
    echo "warning: not building anything"
    mywell-server
    mywell-ui
    mywell-utils
    mywell-gql
    exit 0
    ;;
  all)
    docker-compose build
    mywell-server
    mywell-ui
    mywell-utils
    mywell-gql
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
    docker-compose build mywell-utils
    mywell-utils
    ;;
  mywell-gql)
    docker-compose build mywell-gql
    mywell-gql
    ;;
  *)
    echo "usage: $@ {all, mywell-server, mywell-ui, mywell-utils, mywell-gql}"
    exit 1
    ;;
esac
