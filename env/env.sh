#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#set up the defaults here
export AWS_PROFILE=default
export AWS_REGION=ap-southeast-2
export ENABLE_NOTIFICATIONS=false
export ENABLE_LOGS=true
export SERVER_URL=http://docker.local:3000
export DB_HOST=mywell-db
export DB_NAME=mywell
export DB_PASSWORD=password
export DB_USER=mywell
export IMAGE_SUFFIX=development


# export VERSION_NUMBER
# export WAY2MINT_USR
# export WAY2MINT_PWD
# export SMS_HORIZON_USER
# export SMS_HORIZON_KEY
# export MANAGER_NODE_DNS
# export DEFAULT_DNS_TARGET
# export ENABLE_NOTIFICATIONS
# export ENABLE_LOGS
# export SERVER_URL
# export DB_HOST
# export DB_NAME
# export DB_PASSWORD
# export DB_USER
# export STAGE_PREFIX
# export IMAGE_SUFFIX
# export TWILIO_ACCOUNT_SID
# export TWILIO_AUTH_TOKEN
# export TWILIO_PHONE_NUMBER
# export SERVER_PORT
# export SERVER_UI
# export DONE_SEEDING_SUFFIX
# export TEMP_SERVER_FRONTEND_RULE
# export REACT_APP_GRAPHQL_ENDPOINT
# export UI_BUCKET_NAME
# export WEBPACK_DEV
# export CONSOLE_DOMAIN_NAME
# export FIREBASE_BASE_URL
# export OUR_WATER_ORG_ID
# export REACT_APP_FB_API_KEY
# export REACT_APP_FB_AUTH_DOMAIN
# export REACT_APP_FB_DATABASE_URL
# export REACT_APP_FB_PROJECT_ID
# export REACT_APP_FB_STORAGE_BUCKET