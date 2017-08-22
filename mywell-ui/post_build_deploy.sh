#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#Run the mywell-ui container to finish the build step, and save to s3
BUILD_IMAGE_NAME="mywell-ui-build"

if [ -z "$STAGE" ]; then
  STAGE=local
fi

source $DIR/../env/env$STAGE.sh
#sourcing seems to change the dir.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


#build - use the overide file to ensure we build webpack
# rm -rf /tmp/www && mkdir /tmp/www
# docker-compose -f "$DIR"/../docker-compose.ui.yml up mywell-ui || exit 1

#we can't use docker-compose as we don't want to mount the volumes
docker rm -f "$BUILD_IMAGE_NAME"
docker run --rm \
  -e SERVER_URL \
  -e VERSION_NUMBER \
  -e REACT_APP_GRAPHQL_ENDPOINT \
  --name "$BUILD_IMAGE_NAME" mywell-ui:local

docker rm -f "$BUILD_IMAGE_NAME"
docker run -d --name "$BUILD_IMAGE_NAME" mywell-ui:local bash -c "tail -f /dev/null"
docker cp "$BUILD_IMAGE_NAME":/usr/src/app/www /tmp/

#this gets copied to local as we mount the dir
# cp -R "$DIR"/www /tmp/www

#if this fails, its ok - we can do it later on
aws s3 sync /tmp/www s3://"$UI_BUCKET_NAME"

exit 0

#invalidate the cloudfront cache
aws configure set preview.cloudfront true
aws cloudfront create-invalidation --distribution-id S11A16G5KZMEQD \
  --paths /index.html /error.html
