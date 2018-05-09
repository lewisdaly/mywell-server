DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# HOST="docker.local"
HOST="localhost"

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
export SERVER_URL=http://"$HOST":3000
export VERSION_NUMBER="dev_1.3.6"
export REACT_APP_GRAPHQL_ENDPOINT=http://"$HOST":3001/graphql
export UI_BUCKET_NAME="dev2-mywell.vessels.tech"
export WEBPACK_DEV=true

export FIREBASE_BASE_URL="https://us-central1-our-water.cloudfunctions.net"
export OUR_WATER_ORG_ID="YccAYRrMjdwa0VFuwjVi"
export REACT_APP_FB_AUTH_DOMAIN="our-water.firebaseapp.com"
export REACT_APP_FB_DATABASE_URL="https://our-water.firebaseio.com"
export REACT_APP_FB_PROJECT_ID="our-water"
export REACT_APP_FB_STORAGE_BUCKET="our-water.appspot.com"



source $DIR/env.sh
