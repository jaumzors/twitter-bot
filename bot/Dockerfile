FROM node:10.15.3

LABEL maintainer="Joao Lopes"

RUN mkdir /app
COPY ./configs /app/configs
COPY ./services /app/services
COPY index.js /app

COPY package.json /app

WORKDIR /app

RUN npm install