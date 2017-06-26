DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#the env variables to set up the development environment

export ENABLE_NOTIFICATIONS=false
export ENABLE_LOGS=true
export ENVIRONMENT=development
export REFRESH_UI=false
export SERVER_URL=https://dev-mywell-server.marvi.org.in
export STAGE_PREFIX="dev-"
export DB_HOST="mywelldb.cyftlfi9bxci.ap-southeast-2.rds.amazonaws.com"
export DB_NAME="development_mywell"
export DB_PASSWORD="marvi-mywell"
export DB_USER="mywell"
export IMAGE_SUFFIX="development"
export VERSION_NUMBER="dev_1.3.2"
export SERVER_PORT=3001
export UI_PORT=8002



source $DIR/env.sh
