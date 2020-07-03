import bodyParser from 'body-parser';
import express from 'express';
import pino from 'pino';
import mongo from 'mongodb';
import { Joi, validate } from 'express-validation';

export type BodyParser = typeof bodyParser;
export type Express = typeof express;
export type Pino = typeof pino;
export type MongoModule = typeof mongo;
export type JoiModule = typeof Joi;
export type ValidateMiddleware = typeof validate;
