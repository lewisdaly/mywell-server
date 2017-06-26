#!/bin/bash

#get the file from the bucket
aws s3 cp $SEED_FILE_PATH /tmp/seed_data.sql

echo 'clearing db'
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD -e "CREATE DATABASE $DB_NAME;"
echo 'seeding db...'
mysql -h $DB_HOST $DB_NAME -u $DB_USER -p$DB_PASSWORD < /tmp/seed_data.sql
