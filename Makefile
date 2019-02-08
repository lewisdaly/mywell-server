#
# MyWell
#

# PATH := node_modules/.bin:$(PATH)

PROJECT = "MYWELL"
dir = $(shell pwd)
include .mywell_config
include /tmp/mywell_env


admin_dir := $(dir)/functions/src/admin
env_dir := $(dir)/env


##
# Env Setup
## 
env:
	cat ${env_dir}/env.sh ${env_dir}/.env ${env_dir}/env.${stage}.${location}.sh > /tmp/mywell_env

switch:
	@echo switching to stage: ${stage} ${location}
	@echo 'export stage=${stage}\nexport location=${location}\n' > .mywell_config
	@make env

switch-local-dev:
	make switch stage="development" location="local"
	make env

switch-live-dev:
	make switch stage="development" location="live"
	make env

switch-local-prod:
	make switch stage="production" location="local"
	make env

switch-live-prod:
	make switch stage="production" location="live"
	make env

##
# Local Development
##

build-server:
	@make env
	echo "building server"
	cd ${dir}/mywell-server && npm install
	docker-compose build
	# docker-compose pull


run-server:
	@make env
	./run_server.sh 

# run-lt: 
# 	@make env
# 	@lt --subdomain ${LT_SUBDOMAIN} --port 5000

# run-local:
# 	@make env
# 	./_run_local.sh

# deploy:
# 	@make env
# 	./_deploy.sh

# deploy-vars:
# 	@make env
# 	./_deploy_vars.sh

.PHONY: switch switch-dev swich-prod env