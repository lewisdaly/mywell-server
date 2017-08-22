#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#Run the mywell-ui container to finish the build step, and save to s3

if [ -z "$STAGE" ]; then
  STAGE=local
fi

source $DIR/../env/env$STAGE.sh

#build
docker-compose up -d mywell-ui

docker cp mywell-ui:/usr/src/app/www /tmp/
aws s3 sync /tmp/www s3://"$UI_BUCKET_NAME"

exit 0

#invalidate the cloudfront cache
aws configure set preview.cloudfront true
aws cloudfront create-invalidation --distribution-id S11A16G5KZMEQD \
  --paths /index.html /error.html
