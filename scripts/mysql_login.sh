#! /bin/bash
docker exec -it src_db_1 /bin/bash -c "TERM=dumb mysql mywell -u mywell -ppassword"
