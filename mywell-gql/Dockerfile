FROM node:7

ENV APP_DIR /usr/src/app
ENV PORT 3001

RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

RUN npm install -g nodemon

COPY package.json ./
RUN npm install

COPY ./src ./src/

CMD [ "npm", "start" ]
