/* tslint:disable only-arrow-functions no-unused-expression */

import { expect } from 'chai';
import sinon from 'sinon';
import TaskMongoDao from '../../../../src/dao/mongo/task';

describe('TaskDao', function () {
  let container: any;
  let dbName: any;
  let mongoClientMock: any;
  let dbMock: any;
  let collectionMock: any;
  let cursorMock: any;

  beforeEach(function () {
    cursorMock = { toArray: sinon.stub().resolves([]) };
    collectionMock = { find: sinon.stub().returns(cursorMock) };
    dbMock = { collection: sinon.stub().returns(collectionMock) };
    mongoClientMock = { db: sinon.stub().returns(dbMock) };
    dbName = 'database';
    container = {
      configService: { get: sinon.stub().returns({ database: dbName }) },
      mongoService: { getClient: sinon.stub().returns(mongoClientMock) },
    };
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('find', function () {
    it('should get mongo client from mongo service', async function () {
      const { mongoService } = container;

      const taskDao = new TaskMongoDao(container);
      await taskDao.find({}, {});

      expect(mongoService.getClient).to.have.been.calledOnce;
    });

    it('should select correct db', async function () {
      const taskDao = new TaskMongoDao(container);
      await taskDao.find({}, {});

      expect(mongoClientMock.db).to.have.been.calledOnceWith(dbName);
    });

    it('should select correct collection', async function () {
      const taskDao = new TaskMongoDao(container);
      await taskDao.find({}, {});

      expect(dbMock.collection).to.have.been.calledOnceWith('tasks');
    });

    it('should run query', async function () {
      const query = { name: 'a' };
      const taskDao = new TaskMongoDao(container);
      await taskDao.find(query, {});

      expect(collectionMock.find).to.have.been.calledOnceWith(query);
    });

    it('should pass limit and offset parameters to mongo', async function () {
      const limit = 5;
      const offset = 10;

      const taskDao = new TaskMongoDao(container);
      await taskDao.find({}, { limit, offset });

      expect(collectionMock.find)
        .to
        .have
        .been
        .calledOnceWith(sinon.match.object, { limit, skip: offset });
    });

    it('should return cursor.toArray', async function () {
      const result = ['a', 'b', 'c'];
      cursorMock.toArray = sinon.stub().resolves(result);

      const taskDao = new TaskMongoDao(container);
      const tasks = await taskDao.find({}, {});

      expect(tasks).to.be.equal(result);
    });
  });
});
