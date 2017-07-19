#!/usr/bin/env bash
STACK_NAME=mywell-docker

echo $STAGE

aws cloudformation validate-template --template-body file://./resources.yml --region $AWS_REGION || exit 1

aws cloudformation deploy \
  --stack-name "$STACK_NAME" \
  --template-file ./resources.yml \
  --parameter-overrides \
    KeyName=mywell-docker \
    InstanceType=t2.small \
    ManagerInstanceType=t2.small \
    ClusterSize=1 \
    ManagerSize=1 \
    EnableSystemPrune=yes \
  --capabilities CAPABILITY_IAM
