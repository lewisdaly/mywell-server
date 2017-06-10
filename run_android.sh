#!/bin/bash
export VERSION_NUMBER=1.3.1

cd /Users/lewis/developer/mywell/src/mywell-ui/src
gulp replace --env prod #just once really
gulp babel || exit 1

ionic run android
