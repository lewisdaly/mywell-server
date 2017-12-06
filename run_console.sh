#!/usr/bin/env bash

source ./env/envlocal.sh

if [ "$1" == build ]; then
  cd mywell-console && npm install && cd ..
fi

cd mywell-console && npm run start
