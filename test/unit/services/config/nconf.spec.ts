/* tslint:disable only-arrow-functions no-unused-expression */

import { expect } from 'chai';
import path from 'path';
import sinon from 'sinon';

import NconfConfigService from '../../../../src/services/config/nconf';

describe('NconfConfig service', function () {
  let container: any;

  beforeEach(function () {
    container = {
      nconfProvider: { file() { return this; }, get: sinon.stub() },
      process: { env: {} },
    };
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('load', function () {
    it('should fill NODE_ENV if it is undefined', function () {
      const configService = new NconfConfigService(container);
      configService.load();

      expect(container.process.env.NODE_ENV)
        .to
        .be
        .equal('development');
    });

    it('should not fill NODE_ENV', function () {
      container.process.env.NODE_ENV = 'production';

      const configService = new NconfConfigService(container);
      configService.load();

      expect(container.process.env.NODE_ENV)
        .to
        .be
        .equal('production');
    });

    it('should load environment config', function () {
      const fileSpy = sinon.spy(container.nconfProvider, 'file');
      const fakePath = 'fake';
      sinon.stub(path, 'join').returns(fakePath);

      const configService = new NconfConfigService(container);
      configService.load();

      expect(fileSpy).to.have.been.calledTwice;
      expect(fileSpy.firstCall).to.have.been.calledWith('environment', {
        file: fakePath,
      });
      expect(fileSpy.secondCall).to.have.been.calledWith('default', {
        file: fakePath,
      });
    });
  });

  describe('get', function () {
    it('should return nconf provider get', function () {
      const configService = new NconfConfigService(container);
      const value = 'a';

      container.nconfProvider.get.returns(value);
      const result = configService.get('prop');

      expect(container.nconfProvider.get)
        .to
        .have
        .been
        .calledOnceWith('prop');

      expect(result).to.be.equal(value);
    });
  });
});
