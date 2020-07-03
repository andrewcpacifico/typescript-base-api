/* tslint:disable only-arrow-functions no-unused-expression no-string-literal */

import { expect } from 'chai';
import sinon from 'sinon';

import serverModule from './server';

describe('server', function () {
  let container: any;
  let expressApp: any;
  let config: any;

  beforeEach(function () {
    config = { port: 123 };
    expressApp = {
      listen: sinon.stub().callsFake(({}, cb) => cb()),
      use: sinon.stub(),
    };
    container = {
      express: sinon.stub().returns(expressApp),
      configService: { get: sinon.stub().returns(config) },
      loggerService: { info: sinon.stub(), error: sinon.stub() },
      middlewares: [],
      v1MainRouter: {},
    };
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('start', function () {
    it('should create an express app', async function () {
      const { express } = container;

      const server = serverModule(container);
      await server.start();

      expect(express).to.have.been.calledOnce;
    });

    it('should start express app with configured port', async function () {
      const server = serverModule(container);
      await server.start();

      expect(expressApp.listen).to.have.been.calledOnceWith(config.port);
    });

    it('should reject if express.listen returns error', async function () {
      const error = new Error();
      expressApp.listen = ({}, cb: any) => {
        cb(error);
      };

      const server = serverModule(container);
      try {
        await server.start();
      } catch(err) {
        expect(err).to.be.equal(error);
      }
    });

    it('should apply middlewares', async function () {
      const mid1 = sinon.stub();
      const mid2 = sinon.stub();
      container.middlewares = [mid1, mid2];

      const server = serverModule(container);
      await server.start();

      expect(expressApp.use.withArgs(mid1)).to.have.been.calledOnce;
      expect(expressApp.use.withArgs(mid2)).to.have.been.calledOnce;
    });

    it('should register /v1 route', async function () {
      const server = serverModule(container);
      await server.start();

      expect(expressApp.use).to.have.been.calledWith('/v1', container.v1MainRouter);
    });

    it('should register /v1 route after apply middlewares', async function () {
      const mid1 = sinon.stub();
      const mid2 = sinon.stub();
      container.middlewares = [mid1, mid2];

      const server = serverModule(container);
      await server.start();

      sinon.assert.callOrder(
        expressApp.use.withArgs(mid1),
        expressApp.use.withArgs(mid2),
        expressApp.use.withArgs('/v1', container.v1MainRouter),
      );
    });
  });
});
