/* tslint:disable only-arrow-functions no-unused-expression */

import { expect } from 'chai';
import sinon from 'sinon';

import { MongoService } from '.';

describe('MongoDatabaseService', function () {
  let container: any;
  let config: any;
  let client: any;

  beforeEach(function () {
    client = {};
    config = { host: 'host', database: 'database' };
    container = {
      mongo: { connect: sinon.stub().resolves(client) },
      configService: { get: sinon.stub().returns(config) },
      loggerService: { info: sinon.stub(), error: sinon.stub() },
    };
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('connect', function () {
    it('should get mongo config', async function () {
      const { configService } = container;
      const mongoService: MongoService = new MongoService(container);
      await mongoService.connect();

      expect(configService.get).to.have.been.calledOnceWith('mongo');
    });

    it('should use mongo connect with corret params', async function () {
      const { mongo } = container;
      const { host, database } = config;

      const url = `mongodb://${host}/${database}`;
      const opts = [url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }];

      const mongoService: MongoService = new MongoService(container);
      await mongoService.connect();

      expect(mongo.connect).to.have.been.calledOnceWith(...opts);
    });

    it('should log and throw error', async function () {
      const { mongo, loggerService } = container;
      const err = { msg: 'Error' };

      mongo.connect = sinon.stub().rejects(err);

      const mongoService: MongoService = new MongoService(container);

      try {
        await mongoService.connect();
      } catch(error) {
        expect(error).to.be.equal(err);
        expect(loggerService.error).to.have.been.calledOnce;
      }
    });
  });

  describe('getClient', function () {
    it('should return internal mongo client', function () {
      const mongoService = new MongoService(container);
      const mongoClient = mongoService.getClient();

      expect(mongoClient).to.be.equal(mongoClient);
    });
  });
});
