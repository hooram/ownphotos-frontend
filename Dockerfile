FROM ubuntu:16.04
MAINTAINER ViViDboarder <vividboarder@gmail.com>

RUN apt-get update && \
    apt-get install -y curl && \
    curl --silent --location https://deb.nodesource.com/setup_6.x | bash && \
    apt-get install -y nodejs && \
    apt-get remove --purge -y curl && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install && npm cache clean --force
COPY . /usr/src/app

CMD [ "npm", "start" ]