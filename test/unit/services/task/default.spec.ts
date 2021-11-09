/* tslint:disable only-arrow-functions no-unused-expression no-string-literal */

import sinon from 'sinon';
import { expect } from 'chai';
import DefaultTaskService from '../../../../src/services/task/default';

describe('DefaultTaskService', function () {
  let container: any;

  beforeEach(function () {
    container = {
      taskDao: { find: sinon.stub() },
    };
  });

  describe('getAll', function () {
    it('should call taskDao.find only once', async function () {
      const { taskDao } = container;

      const service = new DefaultTaskService(container);
      await service.getAll();

      expect(taskDao.find).to.have.been.calledOnce;
    });

    it('should call taskDao.find with correct query', async function () {
      const { taskDao } = container;
      const filter = { dueDate: new Date() };

      const service = new DefaultTaskService(container);
      await service.getAll({ filter });

      expect(taskDao.find).to.have.been.calledWith(filter);
    });

    it('should call taskDao.find with limit and offset parameters', async function () {
      const { taskDao } = container;
      const limit = 2;
      const offset = 3;

      const service = new DefaultTaskService(container);
      await service.getAll({ limit, offset });

      expect(taskDao.find).to.have.been.calledWith(undefined, { limit, offset });
    });

    it('should return taskDao.find', async function () {
      const result: any = [];
      const { taskDao } = container;
      taskDao.find.returns(result);

      const service = new DefaultTaskService(container);
      const tasks = await service.getAll();

      expect(tasks).to.be.equal(result);
    });
  });
});
