#!/usr/bin/env bash

ssh -o "StrictHostKeyChecking no" \
    -i $ENV_DIR/.mywell-docker.pem \
    docker@"$MANAGER_NODE_DNS"
