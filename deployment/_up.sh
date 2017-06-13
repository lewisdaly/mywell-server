#!/bin/bash
green='\033[0;32m'
yellow='\033[33m'
bold='\033[1m'
endColor='\033[0m'

MAJOR=0
MINOR=0

incrementMajor() {
  ((MAJOR++))
  echo -e "\n${bold}################# STEP $MAJOR: $1 #######################${endColor}"
  MINOR=0
}

incrementMinor() {
  printMinorStep $1
  ((MINOR++))
}

printMinorStep() {
  printStepSeparator
  echo -e "${bold}$MAJOR.$MINOR:${endColor} $1"
  printStepSeparator
}

printStepSeparator() {
  echo -e "${yellow}------------------------------------${endColor}"
}


# Display welcome message
echo -e "${green}Deploying MyWell\n${endColor}"


incrementMajor "updating-docker-stack"
docker stack deploy --compose-file docker-compose.swarm.yml mywell-development

incrementMajor "updating-resources-stack"
