#!/bin/bash

#check if already done, the suffix file will exist
aws s3 cp "$SEED_FILE_PATH"-"$DONE_SEEDING_SUFFIX" /tmp/
FAILED=$?
if [ $FAILED == 0 ]; then
  echo "DB already seeded"
  exit 0
fi


#get the file from the bucket
aws s3 cp $SEED_FILE_PATH /tmp/seed_data.sql

echo 'clearing db'
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD -e "CREATE DATABASE $DB_NAME;"
echo 'seeding db...'
mysql -h $DB_HOST $DB_NAME -u $DB_USER -p$DB_PASSWORD < /tmp/seed_data.sql

touch tmp
aws s3 cp tmp "$SEED_FILE_PATH"-"$DONE_SEEDING_SUFFIX"
