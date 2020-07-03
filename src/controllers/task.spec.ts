/* tslint:disable only-arrow-functions no-unused-expression */

import { expect } from 'chai';
import sinon from 'sinon';

import { taskControllerModule } from './task';

describe.only('TaskController', function () {
  let container: any;

  beforeEach(function () {
    container = {
      taskService: { getAll: sinon.stub().resolves() },
    };
  });

  describe('list', function () {
    let reqMock: any;
    let resMock: any;

    beforeEach(function () {
      reqMock = {
        query: {
          dueDate: new Date(),
          limit: 1,
          offset: 1,
        },
      };

      resMock = { json: sinon.stub() };
    });

    it('should call taskService.getAll once', async function () {
      const { taskService } = container;
      const controller = taskControllerModule(container);

      await controller.list(reqMock, resMock);

      expect(taskService.getAll).to.have.been.calledOnce;
    });

    it('should pass req.query params to task service', async function () {
      const { taskService } = container;
      const { query } = reqMock;
      const controller = taskControllerModule(container);

      await controller.list(reqMock, resMock);

      expect(taskService.getAll).to.have.been.calledWith({
        filter: { dueDate: query.dueDate },
        limit: query.limit,
        offset: query.offset,
      });
    });
  });
});
