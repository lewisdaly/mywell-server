#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ "$1" == "clean" ]; then
  rm -rf $TMPDIR/react-* && watchman watch-del-all && npm cache clean
  exit 0;
fi


#eg. ./run_device.sh development
_arg_stage="$1"
ENVFILE="$DIR"/../env/env"$_arg_stage".sh
source "$ENVFILE" || exit 1


react-native run-ios
