DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#the env variables to get the deployment tools working

export MANAGER_NODE_DNS="ec2-54-206-75-179.ap-southeast-2.compute.amazonaws.com"
export DEFAULT_DNS_TARGET="mywell-docker-ELB-105870013.ap-southeast-2.elb.amazonaws.com"

source $DIR/env.sh
