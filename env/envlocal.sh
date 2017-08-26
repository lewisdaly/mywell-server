DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#The env variables needed to get the local environment running.
export AWS_PROFILE=vessels-lewis.daly
export ENABLE_NOTIFICATIONS=false
export ENABLE_LOGS=true
export ENVIRONMENT=development
export REFRESH_UI=false
export DB_HOST=db
export DB_NAME=mywell
export DB_PASSWORD=password
export DB_USER=mywell
export SERVER_URL=http://docker.local:3000
export VERSION_NUMBER="dev_1.3.6"
export REACT_APP_GRAPHQL_ENDPOINT=http://docker.local:3001/graphql
export UI_BUCKET_NAME="dev2-mywell.vessels.tech"


source $DIR/env.sh
