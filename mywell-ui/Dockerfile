FROM node:7

ENV NPM_CONFIG_LOGLEVEL warn

#Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install nodemon -g -s

#install dependencies
COPY package.json /usr/src/app/

#install node_modules in different dir that won't be masked by docker volume mounting
RUN mkdir -p /usr/src/lib
RUN ln -s /usr/src/app/package.json /usr/src/lib/.
WORKDIR /usr/src/lib
RUN npm install
ENV NODE_PATH /usr/src/lib/node_modules/
WORKDIR /usr/src/app

COPY ./ /usr/src/app/

#Default envs
ENV ENABLE_LOGS false
ENV VERSION_NUMBER unknown
ENV SERVER_URL http://localhost:3000
ENV ENVIRONMENT development
ENV PORT 8080

#This will get called again when running, but useful to debug Docker before runtime
RUN npm run build
CMD [ "./build_and_run.sh" ]
