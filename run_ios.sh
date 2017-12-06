#!/bin/bash
export VERSION_NUMBER=1.3.1
export ENABLE_LOGS=true

#TODO: set up env variables

cd /Users/lewis/developer/mywell/src/mywell-ui && npm run build
# gulp replace --env prod
# gulp babel || exit 1

if [ "$1" == "emulator" ]; then
  ionic cordova run ios --emulator
fi

ionic cordova run ios --device
