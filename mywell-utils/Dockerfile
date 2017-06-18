FROM alpine:3.5

ENV APP_DIR /usr/src/app
RUN mkdir -p "$APP_DIR"
WORKDIR $APP_DIR

RUN apk -v --update add \
        bash \
        openssh \
        python \
        py-pip \
        groff \
        less \
        mysql \
        mysql-client \
        && \
    pip install --upgrade awscli python-magic && \
    rm /var/cache/apk/*

COPY ./ ./

ENV SEED_FILE_PATH ""
ENV DB_HOST ""
ENV DB_NAME ""
ENV DB_PASSWORD ""
ENV DB_USER ""

CMD [ "entrypoint.sh" ]
