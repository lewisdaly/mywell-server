#!/bin/bash
export VERSION_NUMBER=1.3.1
export ENABLE_LOGS=true

cd /Users/lewis/developer/mywell/src/mywell-ui/src
# gulp replace --env prod
# gulp babel || exit 1

if [ "$1" == "emulator" ]; then
  ionic cordova run ios --emulator
fi

ionic cordova run ios --device
