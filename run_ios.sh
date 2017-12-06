#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MYWELL_UI_DIR="$DIR"/mywell-ui/src

export VERSION_NUMBER=1.3.1
export ENABLE_LOGS=true

<<<<<<< HEAD
#TODO: set up env variables

cd /Users/lewis/developer/mywell/src/mywell-ui && npm run build
# gulp replace --env prod
# gulp babel || exit 1
=======
cd "$MYWELL_UI_DIR"
gulp replace --env prod
gulp babel || exit 1
>>>>>>> 21ab1d0407bf9c47dc16f8a28051e4432c65ab68

if [ "$1" == "emulator" ]; then
  ionic cordova run ios --emulator
fi

ionic cordova run ios --device
