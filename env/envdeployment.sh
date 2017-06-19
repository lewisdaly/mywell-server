DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

export MANAGER_NODE_DNS=ec2-54-252-176-13.ap-southeast-2.compute.amazonaws.com
export DEFAULT_DNS_TARGET="mywell-docker-ELB-105870013.ap-southeast-2.elb.amazonaws.com"
export DB_HOST="mywelldb.cyftlfi9bxci.ap-southeast-2.rds.amazonaws.com"
export DB_PASSWORD="marvi-mywell"

source $DIR/env.sh
