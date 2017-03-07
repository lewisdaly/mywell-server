#!/bin/bash

BACKUP_FOLDER="/root/backups"
if [ $USER == "lewis" ]; then
  #this is just for my local testing
  BACKUP_FOLDER="/Users/lewis/developer/mywell/backups"
fi

mkdir -p $BACKUP_FOLDER

db_container=`docker ps | grep mariadb | awk '{print $11}'`

docker exec $db_container /bin/bash -c "mysqldump -u mywell -ppassword mywell > /tmp/backup.sql"
docker cp $db_container:/tmp/backup.sql $BACKUP_FOLDER/backup.sql
BACKUP_NAME=`tail -1 $BACKUP_FOLDER/backup.sql | awk '{print $5$6}'`
mv $BACKUP_FOLDER/backup.sql $BACKUP_FOLDER/mywell_$BACKUP_NAME.sql

#save to s3
aws s3 cp $BACKUP_FOLDER/mywell_$BACKUP_NAME.sql s3://mywell/backups/


#also save all readings as .csv file:
docker exec $db_container /bin/bash -c "mysqldump -u root -ppassword  --fields-optionally-enclosed-by='\"' --fields-terminated-by=',' --tab /tmp/ mywell reading"
docker cp $db_container:/tmp/reading.txt ./storage/container1/reading.csv
