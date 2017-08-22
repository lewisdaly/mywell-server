FROM node:7

ENV NPM_CONFIG_LOGLEVEL error
ENV APP_DIR /usr/src/app
ENV PORT 3001

RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

COPY .babelrc ./
COPY package.json ./
RUN npm install

COPY ./ ./

RUN npm build
CMD [ "npm", "run", "serve" ]
