FROM node:7

ENV NPM_CONFIG_LOGLEVEL warn

#Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install nodemon -g -s

#install dependencies
COPY package.json /usr/src/app/
RUN npm install

COPY ./ /usr/src/app/

#Default envs
ENV ENABLE_LOGS false
ENV VERSION_NUMBER unknown
ENV SERVER_URL http://localhost:3000
ENV ENVIRONMENT development
ENV PORT 8080

CMD [ "./build_and_run.sh" ]
