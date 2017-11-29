#! /bin/bash

docker_image_name="mywell-db"

if [ "$1" == "test" ]; then
  docker_image_name="test-mywell-db"
fi

docker exec -it $docker_image_name /bin/bash -c "TERM=dumb mysql mywell -u mywell -ppassword"
