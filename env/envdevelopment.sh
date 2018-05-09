DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

unset SERVER_URL

#the env variables to set up the development environment

export ENABLE_NOTIFICATIONS=false
export ENABLE_LOGS=true
export ENVIRONMENT=development
export REFRESH_UI=false
export SERVER_URL=https://dev2-mywell-server.vessels.tech
export DONT_USE_ACCESS_TOKEN=xIYvJnc1R5DDVz1EqwR1BqYG5llm6MU8b1Yb3Pj0JvGsZywfTsbTplCK5sjyQ0Gm
export STAGE_PREFIX="dev2-"
export DB_HOST="mywelldb.cyftlfi9bxci.ap-southeast-2.rds.amazonaws.com"
export DB_NAME="development_mywell"
export DB_PASSWORD="marvi-mywell"
export DB_USER="mywell"
export IMAGE_SUFFIX="development"
export VERSION_NUMBER="dev_1.3.6"
export SERVER_PORT=3002
export UI_PORT=8002
export GQL_PORT=3001
export DONE_SEEDING_SUFFIX="development_done"
export TEMP_SERVER_FRONTEND_RULE="Host:${STAGE_PREFIX}mywell-server.vessels.tech,${STAGE_PREFIX}mywell-server.marvi.org.in"
export REACT_APP_GRAPHQL_ENDPOINT="https://dev2-mywell-gql.vessels.tech/graphql"
export UI_BUCKET_NAME="dev2-mywell.vessels.tech"
export WEBPACK_DEV=false
export CONSOLE_DOMAIN_NAME="dev-mywell-console.vessels.tech"
export FIREBASE_BASE_URL="https://us-central1-our-water.cloudfunctions.net"
export OUR_WATER_ORG_ID="YccAYRrMjdwa0VFuwjVi"

source $DIR/env.sh
