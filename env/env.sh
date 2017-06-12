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
  ' > $DIR/.env
fi

if [ -z $WAY2MINT_USR ]
then
  echo -e "${yellow}Warning: WAY2MINT_USR not set. Cannot set default.${endColor}"
fi

if [ -z $WAY2MINT_PWD ]
then
  echo -e "${yellow}Warning: WAY2MINT_USR not set. Cannot set default.${endColor}"
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
  echo -e "${yellow}Warning: ENABLE_LOGS not set. Defaulting to http://docker.local:3000.${endColor}"
  SERVER_URL=http://docker.local:3000
fi

VERSION_NUMBER="1.3.1"

echo -e "${bold}Configured Environment Variables:${endColor}"
echo "  - VERSION_NUMBER:            $VERSION_NUMBER"
echo "  - WAY2MINT_USR:              $WAY2MINT_USR"
echo "  - WAY2MINT_PWD:              $WAY2MINT_PWD"
echo "  - ENABLE_NOTIFICATIONS:      $ENABLE_NOTIFICATIONS"
echo "  - ENABLE_LOGS:               $ENABLE_LOGS"
echo "  - SERVER_URL:                $SERVER_URL"

export VERSION_NUMBER
export WAY2MINT_USR
export WAY2MINT_PWD
export ENABLE_NOTIFICATIONS
export ENABLE_LOGS
export SERVER_URL
