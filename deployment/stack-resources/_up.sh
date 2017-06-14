#!/bin/bash

#TODO: we will separate out for each stage later on.
STACK_NAME=mywell-resources

echo $STAGE

#NOTE: sadly, we are using JSON instead of YAML. For some reason the yaml parser is complaining about x0000 characters (which I cannot find)
#this looks like an encoding issue- use nano to edit this file!

aws cloudformation validate-template --template-body file://./resources.yml --region $AWS_REGION || exit 1

aws cloudformation deploy \
  --template-file ./resources.yml \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION"

  # --parameter-overrides Stage=$STAGE \
