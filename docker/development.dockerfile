FROM node:16.13.0-slim

ENV CODE /usr/src/app

RUN mkdir -p $CODE

WORKDIR $CODE
