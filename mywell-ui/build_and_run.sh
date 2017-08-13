#!/usr/bin/env bash

cd /usr/src/app
npm run build || exit 1
npm start
