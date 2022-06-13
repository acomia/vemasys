#!/usr/bin/env bash

# set ENVFILE
echo "Set ENVFILE to .env"
set ENVFILE=.env

# verify ENVFILE
echo "Verify ENVFILE..."
printenv | grep 'ENVFILE'

# create .env file with the values set on APPCENTER
echo API_URL=$API_URL >> .env
echo SENTRY_DSN=$SENTRY_DSN >> .env
echo CODEPUSH_DEPLOYMENT_KEY=$CODEPUSH_DEPLOYMENT_KEY >> .env
echo PROD_URL =$PROD_URL >> .env

echo " .env created with following contents:"
cat .env
