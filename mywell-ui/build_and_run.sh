#!/usr/bin/env bash

#TODO: this should run the gulp replace task!

cd /usr/src/app
npm run build
# tail -f /dev/null
 # || exit 1
npm start
