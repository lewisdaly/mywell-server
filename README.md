##getting started

#create the docker machine
$ docker-machine create --driver virtualbox mywell
$ eval $(docker-machine env mywell)

#build and stuff - TODO: make a magic script for this
cd mywell-server
docker build .