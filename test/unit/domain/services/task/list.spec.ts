/* tslint:disable only-arrow-functions no-unused-expression no-string-literal */
import sinon from '@allspark-js/builder/third-party/sinon';
import chai from '@allspark-js/builder/third-party/chai';

const { expect } = chai;

import listTaskService from '@domain/services/task/list';

describe('DefaultTaskService', function () {
  let container: any;

  beforeEach(function () {
    container = {
      taskRepository: { list: sinon.stub() },
    };
  });

  it('should call taskRepository.list only once', async function () {
    const { taskRepository } = container;

    const service = listTaskService(container);
    await service({});

    expect(taskRepository.list).to.have.been.calledOnce;
  });

  it('should call taskRepository.list with correct query', async function () {
    const { taskRepository } = container;
    const filter = { dueDate: new Date() };

    const service = listTaskService(container);
    await service(filter);

    expect(taskRepository.list).to.have.been.calledWithMatch({ filter });
  });

  it('should call taskRepository.list with limit and offset parameters', async function () {
    const { taskRepository } = container;
    const limit = 2;
    const offset = 3;

    const service = listTaskService(container);
    await service({ limit, offset });

    expect(taskRepository.list).to.have.been.calledWith({
      filter: { dueDate: undefined },
      limit,
      offset,
    });
  });

  it('should return taskRepository.list', async function () {
    const result: any = [];
    const { taskRepository } = container;
    taskRepository.list.returns(result);

    const service = listTaskService(container);
    const tasks = await service({});

    expect(tasks).to.be.equal(result);
  });
});
