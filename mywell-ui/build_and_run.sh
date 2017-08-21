#!/usr/bin/env bash

#TODO: this should run the gulp replace task!

cd /usr/src/app
npm run postProcess || exit 1
npm start
