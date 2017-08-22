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
export VERSION_NUMBER="1.3.6"
export SERVER_PORT=3000
export UI_PORT=8000
export DONE_SEEDING_SUFFIX="production_done"
export TEMP_SERVER_FRONTEND_RULE="Host:${STAGE_PREFIX}mywell-server.marvi.org.in,dev-mywell-server.marvi.org.in"
export REACT_APP_GRAPHQL_ENDPOINT="https://mywell-gql.marvi.org.in/graphql"
export UI_BUCKET_NAME="mywell.vessels.tech"



source $DIR/env.sh
