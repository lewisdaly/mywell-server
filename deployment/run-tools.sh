#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#set up envs
source $DIR/../env/envdeployment.sh

if [ -z "$STAGE" ]; then
  echo "Defaulting stage to development."
  export STAGE=development
fi

if [ "$1" == "build" ]
then
	docker-compose build
	docker-compose pull
fi

if [ "$1" == "clear" ]
then
	docker-compose rm -fv
	docker-compose build
	docker-compose pull
fi

if [ "$1" == "deploy" ]
then
  docker-compose up -d
  docker exec mywell-deploy bash -c "sleep 3 && ./_up.sh"
  exit 0
fi

docker-compose up -d
docker exec -it mywell-deploy bash
