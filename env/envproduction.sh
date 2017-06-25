DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#the env variables to set up the development environment

export ENABLE_NOTIFICATIONS=true
export ENABLE_LOGS=false
export ENVIRONMENT=production
export REFRESH_UI=false
export SERVER_URL=https://mywell-server.marvi.org.in
export STAGE_PREFIX=""
export DB_HOST="mywelldb.cyftlfi9bxci.ap-southeast-2.rds.amazonaws.com"
export DB_NAME="production_mywell"
export DB_PASSWORD="marvi-mywell"
export DB_USER="mywell"
export IMAGE_SUFFIX="production"
export VERSION_NUMBER="1.3.3"
export SERVER_PORT=3000
export UI_PORT=8000
export DONE_SEEDING_SUFFIX="development_done"


source $DIR/env.sh
