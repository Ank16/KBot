# syntax=docker/dockerfile:1

ARG NODE_VERSION=18.17.0

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY . .

RUN npm install

ENV DISCORD_TOKEN <INSERT TOKEN HERE>
ENV CLIENTID <INSERT CLIENT ID HERE>
ENV MAINPATH '/usr/src/app'

CMD node index.js
