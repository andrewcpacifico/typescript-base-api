FROM node:20.17.0-slim

ENV CODE /usr/src/app

RUN mkdir -p $CODE

WORKDIR $CODE
