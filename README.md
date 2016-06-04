##getting started

#create the docker machine
$ docker-machine create --driver virtualbox mywell
$ eval $(docker-machine env mywell)

#perhaps need to do this everytime?
docker-machine ssh mywell -f -N -L 3000:localhost:3000

#build and stuff do we need this?- TODO: make a magic script for this
cd mywell-server
docker build .

#or:
./run_server.sh

#to re-build:
./run_server.sh build

#to clear:
./run_server.sh clear



#ssh into server: TODO: make into nice script for each process
docker exec -i -t mywellserver_mywell-server_1 /bin/bash

#connect to mysql
docker exec -it mywellserver_db_1 /bin/bash -c "TERM=dumb mysql mywell -u mywell -ppassword"


