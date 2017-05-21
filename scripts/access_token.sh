#! /bin/bash

if [ "$1" == local ]; then
  HOST="http://docker.local:3000"
else
  HOST="https://mywell-server.marvi.org.in"
fi

curl -# -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -H "Postman-Token: 39606c3a-fa33-b5db-67af-cd5fb6175acc" -d '  {"username":"marvi", "password":"marvi"}' "$HOST/api/Users/login" | awk -F\" '{print $4}' | tail -1 | pbcopy
