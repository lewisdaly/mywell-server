#!/bin/bash
#TODO: fix all the stupid folder refs here
source ./env/envdevelopment.sh

cd /Users/lewis/developer/mywell/src/mywell-ui/src
gulp replace --env prod
gulp babel || exit 1

ionic run android
