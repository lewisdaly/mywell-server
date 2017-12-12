#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


#eg. ./run_device.sh development
_arg_stage="$1"
ENVFILE="$DIR"/../env/env"$_arg_stage".sh

cat $ENVFILE || exit 1
echo "$ENVFILE"

react-native run-ios
