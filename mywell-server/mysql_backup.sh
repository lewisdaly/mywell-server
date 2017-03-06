#!/bin/bash

BACKUP_FOLDER="/root/backups"
if [ $USER == "lewis" ]; then
  #this is just for my local testing
  BACKUP_FOLDER="/Users/lewis/developer/mywell/backups"
fi

mkdir -p $BACKUP_FOLDER

docker exec src_db_1 /bin/bash -c "mysqldump -u mywell -ppassword mywell > /tmp/backup.sql"
docker cp src_db_1:/tmp/backup.sql $BACKUP_FOLDER/backup.sql
BACKUP_NAME=`tail -1 $BACKUP_FOLDER/backup.sql | awk '{print $5$6}'`
mv $BACKUP_FOLDER/backup.sql $BACKUP_FOLDER/mywell_$BACKUP_NAME.sql
