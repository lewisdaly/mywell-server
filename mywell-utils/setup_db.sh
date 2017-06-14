#!/bin/bash


#get the file from the bucket
aws s3 cp $SEED_FILE_PATH /tmp/seed_data


#Log into database!
mysql -h mywelldb.cyftlfi9bxci.ap-southeast-2.rds.amazonaws.com -u mywell -pmarvi-mywell
