/* tslint:disable only-arrow-functions no-unused-expression */

import { expect } from 'chai';
import sinon from 'sinon';

import { bodyParserMiddleware } from '../../../src/middlewares';

describe('bodyParserMiddleware', function () {
  let container: any;
  let jsonHandler: any;

  beforeEach(function () {
    jsonHandler = sinon.stub();
    container = {
      bodyParser: { json: sinon.stub().returns(jsonHandler) },
    };
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('handler', function () {
    it('should call body-parser json handler', function () {
      const req: any = {};
      const res: any = {};
      const next: any = {};
      const { bodyParser } = container;

      const middleware = bodyParserMiddleware(container);
      middleware(req, res, next);

      expect(bodyParser.json).to.have.been.calledOnce;
      expect(jsonHandler).to.have.been.calledOnceWith(req, res, next);
    });
  });
});
