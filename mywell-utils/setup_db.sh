#!/bin/bash


#get the file from the bucket
aws s3 cp $SEED_FILE_PATH /tmp/seed_data
