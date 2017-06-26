#!/usr/bin/env bash

#deploy the docker services
docker stack deploy --compose-file docker-compose.swarm.yml mywell-${STAGE}
