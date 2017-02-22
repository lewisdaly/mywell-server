#!/bin/bash
/docker-entrypoint.sh mysqld &

RETRIES=10

function seedDB() {
  echo 'seeding db'
  mysql -u mywell -ppassword -e "DROP DATABASE mywell;"
  mysql -u mywell -ppassword -e "CREATE DATABASE mywell;"
  mysql mywell -u mywell -ppassword < /usr/ubuntu/mywell_test_seed.sql
  echo 'seeding complete'
  tail -f /dev/null
}

function waitForDB() {
  UP=$(pgrep mysql | wc -l)
  if [ "$UP" -eq 1 ]; then
    echo "mysqld is up and running";
    seedDB
  elif [ $RETRIES -gt 0 ]; then
    echo 'mysqld not up yet'
    sleep 5s
    ((RETRIES--))
    waitForDB
  else
    echo 'Ran out of retries'
    exit 1
  fi
}
sleep 5s
waitForDB

# tail -f /dev/null
