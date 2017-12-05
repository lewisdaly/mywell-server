#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MYWELL_UI_DIR="$DIR"/mywell-ui/src

export VERSION_NUMBER=1.3.1
export ENABLE_LOGS=true

cd "$MYWELL_UI_DIR"
gulp replace --env prod
gulp babel || exit 1

if [ "$1" == "emulator" ]; then
  ionic run ios --emulator
fi

ionic run ios --device
