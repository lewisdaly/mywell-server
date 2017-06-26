#!/usr/bin/env bash

#Get the stack outputs from cloudformation and set env variables

#Note: ideally this would be a function, but we can't set vars from within sub functions
#TODO: finish off this script

STACK_NAME=mywell-docker
echo "$STACK_NAME outputs:"
aws cloudformation describe-stacks  --stack-name "$STACK_NAME"  --query 'Stacks[].Outputs[]'  | \
jq -rc '.[]' | while IFS='' read output;do
    Description=$(echo $output | jq -r ."Description")
    OutputKey=$(echo $output | jq -r ."OutputKey")
    OutputValue=$(echo $output | jq -r ."OutputValue")
    echo "    $OutputKey:$OutputValue"

    export $OutputKey=$OutputValue
done

STACK_NAME=mywell-resources
echo "$STACK_NAME outputs:"
aws cloudformation describe-stacks  --stack-name "$STACK_NAME"  --query 'Stacks[].Outputs[]'  | \
jq -rc '.[]' | while IFS='' read output;do
    Description=$(echo $output | jq -r ."Description")
    OutputKey=$(echo $output | jq -r ."OutputKey")
    OutputValue=$(echo $output | jq -r ."OutputValue")
    echo "    $OutputKey:$OutputValue"

    export $OutputKey=$OutputValue
done
