FROM node:4

RUN apt-get -y update

RUN mkdir -p /usr/src/app
ADD . /usr/src/app/

WORKDIR /usr/src/app
RUN npm install

WORKDIR /usr/src/app/webui
RUN npm install

WORKDIR /usr/src/app

ENV mongohost pgds-minteressa-webdb
ENV mongoport 27017
ENV mongodb minteressa

EXPOSE 8080

CMD [ "npm", "start" ]
