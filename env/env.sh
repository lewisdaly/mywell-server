#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

green='\033[0;32m'
yellow='\033[33m'
bold='\033[1m'
endColor='\033[0m'

# Display welcome message
echo -e "${green}Configuring Environment Variables\n${endColor}"

if [ -s $DIR/.env ]; then
  echo -e "${bold}Loading super secret variables from $DIR/.env${endColor}"
  source $DIR/.env
else
  echo -e "${yellow}No .env file found. Creating one. Please fill it out.${endColor}"
  echo -e 'export WAY2MINT_USR=<INSERT_WAY2MINT_USR_HERE>
  export WAY2MINT_PWD=<INSERT_WAY2MINT_PWD_HERE>
  export MANAGER_NODE_DNS=INSERT_MANAGER_NODE_DNS_HERE>
  export DEFAULT_DNS_TARGET=INSERT_DEFAULT_DNS_TARGET_HERE>
  export TWILIO_ACCOUNT_SID=<INSERT_HERE>
  export TWILIO_AUTH_TOKEN=<INSERT_HERE>
  export TWILIO_PHONE_NUMBER=<INSERT_HERE>
  export SMS_HORIZON_USER=<INSERT_HERE>
  export SMS_HORIZON_KEY=<INSERT_HERE>
  ' > $DIR/.env
fi

if [ -z $AWS_PROFILE ]
then
  echo -e "${yellow}Warning: AWS_PROFILE not set. Defaulting to 'default'.${endColor}"
  AWS_PROFILE=default
fi

if [ -z $AWS_REGION ]
then
  echo -e "${yellow}Warning: AWS_REGION not set. Defaulting to 'ap-southeast-2'.${endColor}"
  AWS_REGION=ap-southeast-2
fi

if [ -z $WAY2MINT_USR ]
then
  echo -e "${yellow}Warning: WAY2MINT_USR not set. Cannot set default.${endColor}"
fi

if [ -z $WAY2MINT_PWD ]
then
  echo -e "${yellow}Warning: WAY2MINT_USR not set. Cannot set default.${endColor}"
fi

if [ -z $SMS_HORIZON_USER ]
then
  echo -e "${yellow}Warning: SMS_HORIZON_USER not set. Cannot set default.${endColor}"
fi

if [ -z $SMS_HORIZON_KEY ]
then
  echo -e "${yellow}Warning: SMS_HORIZON_KEY not set. Cannot set default.${endColor}"
fi

if [ -z $MANAGER_NODE_DNS ]
then
  echo -e "${yellow}Warning: MANAGER_NODE_DNS not set. Cannot set default.${endColor}"
fi

if [ -z $DEFAULT_DNS_TARGET ]
then
  echo -e "${yellow}Warning: DEFAULT_DNS_TARGET not set. Cannot set default.${endColor}"
fi

if [ -z $ENABLE_NOTIFICATIONS ]
then
  echo -e "${yellow}Warning: ENABLE_NOTIFICATIONS not set. Defaulting to false.${endColor}"
  ENABLE_NOTIFICATIONS=false
fi

if [ -z $ENABLE_LOGS ]
then
  echo -e "${yellow}Warning: ENABLE_LOGS not set. Defaulting to true.${endColor}"
  ENABLE_LOGS=true
fi

if [ -z $SERVER_URL ]
then
  echo -e "${yellow}Warning: SERVER_URL not set. Defaulting to http://docker.local:3000.${endColor}"
  SERVER_URL=http://docker.local:3000
fi

if [ -z $DB_HOST ]
then
  echo -e "${yellow}Warning: DB_HOST not set. Defaulting to mywell-db.${endColor}"
  DB_HOST=mywell-db
fi

if [ -z $DB_NAME ]
then
  echo -e "${yellow}Warning: DB_NAME not set. Defaulting to mywell.${endColor}"
  DB_NAME=mywell
fi

if [ -z $DB_PASSWORD ]
then
  echo -e "${yellow}Warning: DB_PASSWORD not set. Defaulting to password.${endColor}"
  DB_PASSWORD=password
fi

if [ -z $DB_USER ]
then
  echo -e "${yellow}Warning: DB_USER not set. Defaulting to mywell.${endColor}"
  DB_USER=mywell
fi

if [ -z $IMAGE_SUFFIX ]
then
  echo -e "${yellow}Warning: IMAGE_SUFFIX not set. Defaulting to development.${endColor}"
  IMAGE_SUFFIX=development
fi

echo -e "${bold}Configured Environment Variables:${endColor}"
echo "  - AWS_PROFILE:                 $AWS_PROFILE"
echo "  - AWS_REGION:                  $AWS_REGION"
echo "  - VERSION_NUMBER:              $VERSION_NUMBER"
echo "  - WAY2MINT_USR:                $WAY2MINT_USR"
echo "  - WAY2MINT_PWD:                $WAY2MINT_PWD"
echo "  - SMS_HORIZON_USER:            $SMS_HORIZON_USER"
echo "  - SMS_HORIZON_KEY:             $SMS_HORIZON_KEY"
echo "  - MANAGER_NODE_DNS:            $MANAGER_NODE_DNS"
echo "  - DEFAULT_DNS_TARGET:          $DEFAULT_DNS_TARGET"
echo "  - ENABLE_NOTIFICATIONS:        $ENABLE_NOTIFICATIONS"
echo "  - ENABLE_LOGS:                 $ENABLE_LOGS"
echo "  - SERVER_URL:                  $SERVER_URL"
echo "  - DB_HOST:                     $DB_HOST"
echo "  - DB_NAME:                     $DB_NAME"
echo "  - DB_PASSWORD:                 $DB_PASSWORD"
echo "  - DB_USER:                     $DB_USER"
echo "  - STAGE_PREFIX:                $STAGE_PREFIX"
echo "  - IMAGE_SUFFIX:                $IMAGE_SUFFIX"
echo "  - TWILIO_ACCOUNT_SID:          $TWILIO_ACCOUNT_SID"
echo "  - TWILIO_AUTH_TOKEN:           $TWILIO_AUTH_TOKEN"
echo "  - TWILIO_PHONE_NUMBER:         $TWILIO_PHONE_NUMBER"
echo "  - SERVER_PORT:                 $SERVER_PORT"
echo "  - UI_PORT:                     $UI_PORT"
echo "  - DONE_SEEDING_SUFFIX:         $DONE_SEEDING_SUFFIX"
echo "  - TEMP_SERVER_FRONTEND_RULE:   $TEMP_SERVER_FRONTEND_RULE"
echo "  - REACT_APP_GRAPHQL_ENDPOINT:  $REACT_APP_GRAPHQL_ENDPOINT"
echo "  - UI_BUCKET_NAME:              $UI_BUCKET_NAME"
echo "  - WEBPACK_DEV:                 $WEBPACK_DEV"
echo "  - CONSOLE_DOMAIN_NAME:         $CONSOLE_DOMAIN_NAME"
echo "  - FIREBASE_BASE_URL:           $FIREBASE_BASE_URL"
echo "  - OUR_WATER_ORG_ID:            $OUR_WATER_ORG_ID"
echo "  - REACT_APP_FB_API_KEY:        $REACT_APP_FB_API_KEY"
echo "  - REACT_APP_FB_AUTH_DOMAIN:    $REACT_APP_FB_AUTH_DOMAIN"
echo "  - REACT_APP_FB_DATABASE_URL:   $REACT_APP_FB_DATABASE_URL"
echo "  - REACT_APP_FB_PROJECT_ID:     $REACT_APP_FB_PROJECT_ID"
echo "  - REACT_APP_FB_STORAGE_BUCKET: $REACT_APP_FB_STORAGE_BUCKET"




export AWS_PROFILE
export AWS_REGION
export VERSION_NUMBER
export WAY2MINT_USR
export WAY2MINT_PWD
export SMS_HORIZON_USER
export SMS_HORIZON_KEY
export MANAGER_NODE_DNS
export DEFAULT_DNS_TARGET
export ENABLE_NOTIFICATIONS
export ENABLE_LOGS
export SERVER_URL
export DB_HOST
export DB_NAME
export DB_PASSWORD
export DB_USER
export STAGE_PREFIX
export IMAGE_SUFFIX
export TWILIO_ACCOUNT_SID
export TWILIO_AUTH_TOKEN
export TWILIO_PHONE_NUMBER
export SERVER_PORT
export SERVER_UI
export DONE_SEEDING_SUFFIX
export TEMP_SERVER_FRONTEND_RULE
export REACT_APP_GRAPHQL_ENDPOINT
export UI_BUCKET_NAME
export WEBPACK_DEV
export CONSOLE_DOMAIN_NAME
export FIREBASE_BASE_URL
export OUR_WATER_ORG_ID
export REACT_APP_FB_API_KEY
export REACT_APP_FB_AUTH_DOMAIN
export REACT_APP_FB_DATABASE_URL
export REACT_APP_FB_PROJECT_ID
export REACT_APP_FB_STORAGE_BUCKET