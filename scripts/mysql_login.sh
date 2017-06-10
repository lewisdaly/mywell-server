#! /bin/bash

docker_image_name="mywell-db"

docker exec -it $docker_image_name /bin/bash -c "TERM=dumb mysql mywell -u mywell -ppassword"
