#!/bin/bash

echo "  - DB_HOST:      $DB_HOST"
echo "  - DB_NAME:      $DB_NAME"
echo "  - DB_PASSWORD:  $DB_PASSWORD"
echo "  - DB_USER:      $DB_USER"

#seed the database etc.
./setup_db.sh

echo "All done. Waiting forever now"
tail -f /dev/null
