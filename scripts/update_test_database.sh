#!/bin/bash
echos 'Make sure the proper db is running first!'

docker exec src_db_1 /bin/bash -c "mysqldump -u mywell -ppassword mywell > /tmp/backup.sql"
mv mywell_test_seed.sql mywell_test_seed2.sql
docker cp src_db_1:/tmp/backup.sql mywell_test_seed.sql
