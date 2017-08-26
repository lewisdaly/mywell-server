#!/bin/bash
green='\033[0;32m'
yellow='\033[33m'
bold='\033[1m'
endColor='\033[0m'

MAJOR=0
MINOR=0

STACK_DOCKER_SWARM_DIR=$DEPLOYMENT_DIR/stack-docker-swarm
STACK_RESOURCES_DIR=$DEPLOYMENT_DIR/stack-resources
SERVICES_TOOLS_DIR=$DEPLOYMENT_DIR/service-tools
SERVICES_MYWELL_DIR=$DEPLOYMENT_DIR/service-mywell

# TODO: way to do individual steps and stuff

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


preDeploySteps() {
  incrementMajor "pre-deploy-steps"

}

deployInfrastructure() {
  incrementMajor "deploy-infrastructure"

  incrementMinor "updating-static-resources"
  aws s3 sync /tmp/www s3://"$UI_BUCKET_NAME"

  incrementMinor "updating-docker-stack"
  cd $STACK_DOCKER_SWARM_DIR
  # ./_up.sh

  incrementMinor "updating-resources-stack"
  cd $STACK_RESOURCES_DIR
  # ./_up.sh
}

deployServices() {
  incrementMajor "deploy-services"

  incrementMinor "updating-service-tools"
  cd $SERVICES_TOOLS_DIR
  # ./_up.sh

  incrementMinor "updating-service-mywell"
  cd $SERVICES_MYWELL_DIR
  ./_up.sh
}

postDeploySteps() {
  incrementMajor "post-deploy-steps"

}

# Display welcome message
printStepSeparator
echo -e "${green}---Deploying MyWell: "$STAGE"---${endColor}"
printStepSeparator


preDeploySteps
deployInfrastructure
deployServices
postDeploySteps
