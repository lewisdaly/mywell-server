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



#### Moving backup files to correct bucket
```
#From docker swarm, login to mywell-utils

export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=
export AWS_DEFAULT_REGION=ap-south-1

aws s3 ls s3://mywell/backups/mywell_2017-06-253:12:22.sql
aws s3 cp s3://mywell/backups/mywell_2017-06-253:12:22.sql /tmp/
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY
unset AWS_DEFAULT_REGION
aws s3 ls
aws s3 cp /tmp/mywell_2017-06-253:12:22.sql s3://mywell-deployment/restore/
```



#### run out of space in docker swarm!

##### cleanup images
docker rmi $(docker images -q --filter "dangling=true")



### copy dev db to local:

#### in mywell-utils
```
#mysql -h mywelldb.cyftlfi9bxci.ap-southeast-2.rds.amazonaws.com  -u mywell -p<pwd>

mysqldump --host=mywelldb.cyftlfi9bxci.ap-southeast-2.rds.amazonaws.com  \
          -u mywell \
          -pmarvi-mywell \
          production_mywell > /tmp/backup.sql

aws s3 cp /tmp/backup.sql s3://mywell-deployment/backup/2017-09-02-production-mywell.sql

aws s3 cp s3://mywell-deployment/backup/2017-09-02-production-mywell.sql /tmp/

#on local
docker cp /tmp/2017-09-02-production-mywell.sql mywell-db:/tmp/
docker exec -it mywell-db bash
mysql  mywell -u $MYSQL_USER -p$MYSQL_ROOT_PASSWORD < /tmp/2017-09-02-production-mywell.sql
```
