#! /bin/bash

docker_image_name="mywell-server"

if [ "$1" == "test" ]; then
  docker_image_name="test-mywell-server"
fi

docker exec -it "$docker_image_name" /bin/bash
