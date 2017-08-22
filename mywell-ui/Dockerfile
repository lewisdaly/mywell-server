FROM node:7

ENV NPM_CONFIG_LOGLEVEL warn

#Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app


RUN npm install nodemon -g -s

#install dependencies
COPY package.json /usr/src/app/
RUN npm install

#install node_modules in different dir that won't be masked by docker volume mounting - doesn't work easily...
# RUN mkdir -p /usr/src/lib
# RUN ln -s /usr/src/app/package.json /usr/src/lib/.
# WORKDIR /usr/src/lib
# RUN npm install
# ENV NODE_PATH /usr/src/lib/node_modules/
# WORKDIR /usr/src/app

COPY ./ /usr/src/app/

#Default envs
ENV ENABLE_LOGS false
ENV ENVIRONMENT development
ENV PORT 8080
#These env variables will first get replaced by webpack in the 'build step'
#then by gulp when actually running
ENV VERSION_NUMBER __VERSION_NUMBER__
ENV SERVER_URL __SERVER_URL__
ENV REACT_APP_GRAPHQL_ENDPOINT __REACT_APP_GRAPHQL_ENDPOINT__

#prebuild - this does most of the work
# the only way this would work is if we did it all on the same line as npm install...
RUN npm run build

#remove dev dependencies - make our docker image super small
# RUN npm prune --production
# RUN rm -rf platforms plugins resources src
#TODO: we can also remove just about everything else, lib, almost all node_modules, plugins, src

CMD [ "npm", "run", "build" ]
