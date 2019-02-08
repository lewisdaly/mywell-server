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

aws s3 cp /tmp/backup.sql s3://mywell-deployment/backup/2019-02-09-production-mywell.sql

aws s3 cp s3://mywell-deployment/backup/2019-02-09-production-mywell.sql /tmp/

#on local
docker cp /tmp/2017-09-02-production-mywell.sql mywell-db:/tmp/
docker exec -it mywell-db bash
mysql  mywell -u $MYSQL_USER -p$MYSQL_ROOT_PASSWORD < /tmp/2017-09-02-production-mywell.sql
```


### SMS Queries:


users can submit readings over a single SMS message.

The format for these queries starts as follows:
```
[<SERVICE_CODE> ]<MESSAGE_CODE>
```
where <SERVICE_CODE> is the optional code specifying the service. The default for MyWell will be `MYWL`.

>*A note about SERVICE_CODES*
Service codes can serve a dual purpose in the MyWell system. In India, SMS providers share 1 number between many customers. As a result, users are required to specify a code at the start of the SMS, in order to get the message routed to the correct place.

>For deployments of MyWell in other regions, this may or may not be required, but this design decision gives us the ability to share numbers between multiple deployments of MyWell, if this is required in the future.


MESSAGE_CODE is a code denoting the type of message the user will be sending. They are:

- `S` - saves a new reading.
- `Q` - queries an existing resource. This can be by postcode, village, or individual resource.

#### save message:

```
S <POSTCODE>/<RESOURCE_ID>/[<DATE>/]<READING>
```

The date must be in a YYMMD format, and is optional. If not specified, the reading will default to the current date.

for example:
```bash
# for the service MyWell, save a reading of 3000 units for the resource 1501 in postcode 313603
MYWL S 313603/1501/3000

# or, specifying the date for a past reading:
MYWL S 313603/1501/170101/3000
#will save a reading of 3000 units on the 1st of January, 2017 for the resource 1501 in postcode 313603
```

#### query message:

```
Q <POSTCODE>[/<VILLAGE_ID>|/<RESOURCE_ID>]
```

Where:
<POSTCODE> is the postcode containing the resources.
<VILLAGE_ID> is a 2 digit ID referring to a group of resources
<RESOURCE_ID> is a 4 digit ID, specifying a specific resource within a village. The first 2 digits of the resourceId are the villageId.


## for example:
``` bash
#for the service MyWell, get the report for the resources in postcode 313603
MYWL Q 313603

#for the service MyWell, get the report for the resources in village 15 in postcode 313603
MYWL Q 313603/15

#for the service MyWell, get the report for a single resource with id: 1105 in postcode 313603
MYWL Q 313603/1105
```


## example responses:
`MYWL Q 313603`
>For pincode 313603, the average depth to water level is 45.54m.

`MYWL Q 313603/15`
>Badgaon has an average depth to water level of 33.34m

`MYWL Q 313603/1511`
>Well 11 in Badgaon has a depth to water level of 23.34m

`MYWL Q 313603/1581`
>Raingauge 81 in Badgaon's last reading was 11mm

next steps:
- Add the cumulative rainfall into the village and pincode query, eg:
  >For pincode 313603, the average depth to water level is 45.54m. The has been 12mm of rain in the last 1 month.`


## Manual Migrations


This is a super hacky manual migration to set all of the createdAts.

We are doing this because Loopback sucks, and right now, it's just easier to do things in the db.

```sql
update resource set createdAt = NOW() where createdAt is null;
update Client set createdAt = NOW() where createdAt is null;
```

Please don't do this at home, kids
