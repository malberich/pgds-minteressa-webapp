FROM ubuntu:trusty

RUN apt-get update \
  && apt-get upgrade -y \
  && apt-get install -y \
    curl \
    build-essential \
    python2.7 \
    libtool \
    libpthread-stubs0-dev \
    python2.7-dev \
  	python-pip \
  	libboost-program-options-dev \
  	libboost-python-dev \
  	git \
  	zlib1g-dev \
  && apt-get clean -y

RUN curl -sL https://deb.nodesource.com/setup_4.x | bash
RUN apt-get install -y nodejs

RUN mkdir -p /opt/src
WORKDIR /opt/src
RUN git clone https://github.com/edenhill/librdkafka.git

WORKDIR /opt/src/librdkafka
# RUN git checkout tags/debian/0.9.1-1
RUN ./configure
RUN make
RUN make install
ENV LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/lib

RUN mkdir -p /opt/app

WORKDIR /opt/app
ADD src .
RUN npm install && \
	npm cache clean

WORKDIR /opt/app/webui
RUN npm install && \
	npm cache clean

WORKDIR /opt/app

ENV mongohost pgds-mongo
ENV mongoport 27017
ENV mongodb minteressa

RUN rm -rf /var/lib/apt/lists/*

EXPOSE 8080

CMD [ "npm", "start" ]
