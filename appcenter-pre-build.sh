#!/usr/bin/env bash

# set ENVFILE
set ENVFILE=.env

# verify ENVFILE
printenv | grep 'ENVFILE'

# create .env file with the values set on APPCENTER
cp .env.example .env

echo " .env created with following contents:"
cat .env
