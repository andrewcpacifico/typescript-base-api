FROM node:14.0.0-slim

ENV CODE /usr/src/app

RUN mkdir -p $CODE

WORKDIR $CODE
