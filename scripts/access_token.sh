#! /bin/bash

if [ "$1" == local ]; then
  HOST="http://localhost:3000"
elif [ "$1" == dev ]; then
  HOST="https://dev2-mywell-server.marvi.org.in"
else
  HOST="https://mywell-server.marvi.org.in"
fi


echo $HOST
curl -# -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -H "Postman-Token: 39606c3a-fa33-b5db-67af-cd5fb6175acc" -d '  {"username":"marvi", "password":"marvi"}' "$HOST/api/Users/login" | awk -F\" '{print $4}' | tail -1 | pbcopy
