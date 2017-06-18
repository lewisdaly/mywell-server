FROM docker:dind

ENV DEPLOYMENT_DIR /usr/src/deploy
ENV ENV_DIR /usr/src/env
ENV DOCKER_TUNNEL_PORT 2374
ENV DOCKER_HOST="tcp://localhost:$DOCKER_TUNNEL_PORT"

RUN mkdir -p $DEPLOYMENT_DIR
RUN mkdir -p $ENV_DIR

WORKDIR ${DEPLOYMENT_DIR}

RUN apk -v --update add \
        bash \
        openssh \
        python \
        py-pip \
        groff \
        less \
        jq \
        && \
    pip install --upgrade awscli python-magic && \
    apk -v --purge del py-pip && \
    rm /var/cache/apk/*

#shell config
COPY ./docker/passwd /etc/passwd
COPY ./docker/bash_rc /root/.bashrc


CMD [ "tail", "-f", "/dev/null" ]
