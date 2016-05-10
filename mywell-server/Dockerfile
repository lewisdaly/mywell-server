FROM node:latest

#Create app directory
RUN mkdir -p /usr/src/app

RUN npm install nodemon -g

WORKDIR /usr/src/app # this corresponds to the mounted dir in ../docker-compose.yml

#install dependencies
ADD package.json /usr/src/app/
RUN npm install

EXPOSE 3000

CMD [ "nodemon", "-L", "." ]