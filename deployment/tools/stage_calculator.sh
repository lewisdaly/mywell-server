#!/usr/bin/env bash

echo "calculating stage from branch: $TRAVIS_BRANCH"
#Given a branch name, figure out what stage we are in.
case "$TRAVIS_BRANCH" in
  develop)
    export STAGE=development
    ;;
  master)
    export STAGE=production
    ;;
  *)
    echo "Unknown stage for: $TRAVIS_BRANCH"
    exit 0
    ;;
esac

echo "resolved stage: $STAGE"
