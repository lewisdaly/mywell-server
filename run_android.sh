#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ "$1" == "development" ]; then
  source "$DIR/env/envdevelopment.sh"
else
  source "$DIR/env/envproduction.sh"
fi

cd /Users/lewis/developer/mywell/src/mywell-ui/src
gulp replace --env prod
gulp babel || exit 1

ionic run android
