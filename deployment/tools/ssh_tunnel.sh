#!/bin/bash

if [ "$1" == "kill" ]; then
  echo "killing running ssh tunnel"
  ps aux | grep "ssh -i" | awk '{print $2}' | xargs kill -9
  exit 0
fi

ssh -o "StrictHostKeyChecking no" \
    -i ~/.aws/keys/mywell-docker.pem \
    -NL localhost:"$DOCKER_TUNNEL_PORT":/var/run/docker.sock docker@"$MANAGER_NODE_DNS" &

echo "Tunnelling!"
echo "..."
sleep 5
echo "Done. Should be up now."
