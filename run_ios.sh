#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MYWELL_UI_DIR="$DIR"/mywell-ui/src

export VERSION_NUMBER=1.3.1
export ENABLE_LOGS=true

cd /Users/lewis/developer/mywell/src/mywell-ui && npm run build:local

if [ "$1" == "emulator" ]; then
  ionic cordova run ios --emulator
  exit 0
fi

ionic cordova run ios --device
