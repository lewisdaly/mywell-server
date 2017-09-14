#!/bin/bash

#TODO: we will separate out for each stage later on.
STACK_NAME="$STAGE"-mywell-console

echo $STAGE
echo "$CONSOLE_DOMAIN_NAME"

aws cloudformation validate-template --template-body file://./resources.yml --region $AWS_REGION || exit 1
aws cloudformation deploy \
  --template-file ./resources.yml \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION" \
  --parameter-overrides \
    HostedZoneName=vessels.tech. \
    RootDomainName=mywell.vessels.tech \
    ConsoleDomainName="$CONSOLE_DOMAIN_NAME" \
    AcmCertificateArn=arn:aws:acm:us-east-1:745457803371:certificate/844bae3b-5832-402b-93aa-6566de7f3561
