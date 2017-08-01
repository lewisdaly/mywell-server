#!/usr/bin/env bash

ssh -o "StrictHostKeyChecking no" \
    -i $ENV_DIR/.mywell-docker.pem \
    docker@"$MANAGER_NODE_DNS"


# ssh -A docker@"$MANAGER_NODE_DNS" -o "StrictHostKeyChecking no" \
#     -i $ENV_DIR/.mywell-docker.pem \
#     -t 'ssh -A docker@54.252.180.17'


#copy private key:
#scp -i $ENV_DIR/.mywell-docker.pem $ENV_DIR/.mywell-docker.pem docker@"$MANAGER_NODE_DNS":/home/docker
#log into other instance
#ssh -i /home/docker/.mywell-docker.pem docker@ip-172-31-44-113.ap-southeast-2.compute.internal
