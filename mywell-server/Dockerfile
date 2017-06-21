FROM node:6

#Create app directory
RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/storage

WORKDIR /usr/src/app

RUN npm config set silent true
RUN npm install -g nodemon loopback

COPY package.json /usr/src/app/
RUN npm install

COPY ./ /usr/src/app/

EXPOSE 3000

ENV DB_HOST mywell-db
ENV DB_NAME mywell
ENV DB_PASSWORD password
ENV DB_USER mywell

CMD [ "nodemon", "-L", "." ]
# OR run migrator!
