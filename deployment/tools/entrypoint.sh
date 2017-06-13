#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#set up ssh tunnel
$DIR/ssh_tunnel.sh kill
$DIR/ssh_tunnel.sh

tail -f /dev/null
