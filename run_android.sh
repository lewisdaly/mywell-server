#!/bin/bash

cd /Users/lewis/developer/mywell/src/mywell-ui/src
gulp replace --env prod #just once really
gulp babel || exit 1

ionic run android
