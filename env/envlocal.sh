DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#The env variables needed to get the local environment running.
export ENABLE_NOTIFICATIONS=false
export ENABLE_LOGS=true
export ENVIRONMENT=development
export REFRESH_UI=false
export DB_HOST=db
export DB_NAME=mywell
export DB_PASSWORD=password
export DB_USER=mywell
export SERVER_URL=http://docker.local:3000
export VERSION_NUMBER="dev_1.3.5"
export REACT_APP_GRAPHQL_ENDPOINT=http://docker.local:3001/graphql


source $DIR/env.sh
