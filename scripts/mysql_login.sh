#! /bin/bash

docker_image_name="src_db_1"
if [ "$1" = "test" ]; then
  docker_image_name="mywellserver_test_db_1"
fi

docker exec -it $docker_image_name /bin/bash -c "TERM=dumb mysql mywell -u mywell -ppassword"
