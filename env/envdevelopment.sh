DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

export ENABLE_NOTIFICATIONS=false
export ENABLE_LOGS=true
export ENVIRONMENT=development
export REFRESH_UI=false
export SERVER_URL=dev.mywell-server.vesselstech.com

source $DIR/env.sh
