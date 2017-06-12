#!/bin/bash

ssh -i ~/.ssh/mywell-docker.pem -NL localhost:2374:/var/run/docker.sock docker@ec2-52-221-199-231.ap-southeast-1.compute.amazonaws.com &


export DOCKER_HOST=localhost:2374
docker info
