DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

export ENABLE_NOTIFICATIONS=false
export ENABLE_LOGS=true
export ENVIRONMENT=development
export REFRESH_UI=false
export DB_HOST=db
export DB_NAME=mywell
export DB_PASSWORD=password
export DB_USER=mywell

source $DIR/env.sh
