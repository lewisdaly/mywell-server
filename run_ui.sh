#!/usr/bin/env bash

source ./env/envlocal.sh

if [ "$1" == build ]; then
  cd mywell-ui && npm install && cd ..
fi

cd mywell-ui && npm run dev
