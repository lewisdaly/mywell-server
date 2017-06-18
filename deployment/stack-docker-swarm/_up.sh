#!/usr/bin/env bash
STACK_NAME=mywell-docker

echo $STAGE

aws cloudformation validate-template --template-body file://./resources.yml --region $AWS_REGION || exit 1
