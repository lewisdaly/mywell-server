#!/bin/bash


if [ "$1" == "kill" ]; then
  echo "killing running ssh tunnel"
  ps aux | grep "ssh -i" | awk '{print $2}' | xargs kill -9
  exit 0
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source $DIR/../env/env$STAGE.sh

ssh -i ~/.ssh/mywell-docker.pem -NL localhost:2374:/var/run/docker.sock docker@"$MANAGER_NODE_DNS" &


unset DOCKER_MACHINE_NAME
unset DOCKER_TLS_VERIFY
unset DOCKER_CERT_PATH
export DOCKER_HOST="tcp://localhost:2374"

docker info
