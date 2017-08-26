#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/..
mkdir -p ./mywell-ui/src/www/react
docker exec -it mywell-console bash -c "npm run build"
cp -R ./mywell-console/build/ ./mywell-ui/src/www/react/
