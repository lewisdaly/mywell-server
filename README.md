##MyWell

MyWell is a system for tracking well levels. MyWell_Server is an express app, MyWell_Client is an AngularJS/Ionic web application.
MyWell is managed with docker-compose.

### Project Structure
---

```
MyWell_Server
 |
 |-MyWell_Client

```

### Getting Started
---
####create the docker machine (os-x)
```
docker-machine create --driver virtualbox mywell
eval $(docker-machine env mywell)
```

####map docker to local machine
```
docker-machine ssh mywell -f -N -L 3000:localhost:3000
```

####start docker-compose
```
./run_server.sh
./run_server.sh clear #this removes existing docker container and re makes it
./run_server.sh build #this forces docker-compose to rebuild
```

###Development
---

#####to manually build the server: (this is done automagically by docker-compose)
```
cd mywell-server
docker build .
```

#####SSH into running server inside of docker
```
docker exec -i -t mywellserver_mywell-server_1 /bin/bash
```

#####connect to mysql
```
docker exec -it mywellserver_db_1 /bin/bash -c "TERM=dumb mysql mywell -u mywell -ppassword"
```




register.js --file ../scripts/test_resource.csv --type resource
./signup_preprocessor.py --input_path ../../data/rainfall_station_registration.csv  --resource_type raingauge --output_path test
