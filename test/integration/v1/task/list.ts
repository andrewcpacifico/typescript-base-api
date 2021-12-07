import chai from '@allspark-js/builder/third-party/chai';
import request from '@allspark-js/builder/third-party/supertest';
import { ObjectId } from '@allspark-js/core/third-party/mongodb';
import express from '@allspark-js/rest/third-party/express';
import { ExpressServer } from '@allspark-js/rest';

import restMain, { TDependencyContainer } from '@rest/index';

const { expect } = chai;

function getCollection(collection: string, container: TDependencyContainer) {
  const { configManager, mongoManager } = container;
  const mongoClient = mongoManager.getClient();
  const db = mongoClient.db(configManager.get('mongo:database'));

  return db.collection(collection);
}

describe('List tasks', function () {
  let app: express.Express;
  let dependencyContainer: TDependencyContainer;

  before(async function () {
    dependencyContainer = await restMain({ start: false });
    app = (dependencyContainer.server as ExpressServer).getApp();
  });

  after(async function () {
    const { mongoManager } = dependencyContainer;
    await mongoManager.disconnect();
  });

  describe('GET /v1/tasks', function () {
    const tasks = [
      {
        _id: new ObjectId(),
        title: 'task 1',
        dueDate: new Date('2020-10-01T01:00:00.000Z'),
      },
      {
        _id: new ObjectId(),
        title: 'task 2',
        dueDate: new Date('2020-10-01T00:00:00.000Z'),
      },
      {
        _id: new ObjectId(),
        title: 'task 3',
      },
      {
        _id: new ObjectId(),
        title: 'task 4',
      },
      {
        _id: new ObjectId(),
        title: 'task 5',
      },
    ];

    before(async function () {
      const collection = getCollection('tasks', dependencyContainer);
      await collection.deleteMany({});
      return collection.insertMany(tasks);
    });

    after(function () {
      const collection = getCollection('tasks', dependencyContainer);
      return collection.deleteMany({});
    });

    it('should respond with correct array of tasks', async function () {
      const expectedTasks = tasks.map(({
        _id, title, dueDate,
      }) => ({
        id: _id.toHexString(),
        title,
        ...(dueDate !== undefined) && { dueDate: dueDate.toISOString() },
      }));

      const res = await request(app)
        .get('/v1/tasks');

      expect(res.status).to.be.equal(200);
      expect(res.header['Content-Type'], 'application/json');
      expect(res.body).to.be.deep.equal({ tasks: expectedTasks });
    });

    it('should slice result using limit parameter', async function () {
      const expectedTasks = tasks.map(({
        _id, title, dueDate,
      }) => ({
        id: _id.toHexString(),
        title,
        ...(dueDate !== undefined) && { dueDate: dueDate.toISOString() },
      })).slice(0, 2);

      const res = await request(app)
        .get('/v1/tasks?limit=2');

      expect(res.status).to.be.equal(200);
      expect(res.header['Content-Type'], 'application/json');
      expect(res.body).to.be.deep.equal({ tasks: expectedTasks });
    });

    it('should paginate correctly', async function () {
      const expectedTasks = tasks.map(({
        _id, title, dueDate,
      }) => ({
        id: _id.toHexString(),
        title,
        ...(dueDate !== undefined) && { dueDate: dueDate.toISOString() },
      })).slice(2, 4);

      const res = await request(app)
        .get('/v1/tasks?limit=2&offset=2');

      expect(res.status).to.be.equal(200);
      expect(res.header['Content-Type'], 'application/json');
      expect(res.body).to.be.deep.equal({ tasks: expectedTasks });
    });

    it('should filter by dueDate', async function () {
      const expectedTasks = tasks.map(({
        _id, title, dueDate,
      }) => ({
        id: _id.toHexString(),
        title,
        ...(dueDate !== undefined) && { dueDate: dueDate.toISOString() },
      })).filter((task) => !!task.dueDate);

      const res = await request(app)
        .get('/v1/tasks?dueDate=2020-10-01');

      expect(res.status).to.be.equal(200);
      expect(res.header['Content-Type'], 'application/json');
      expect(res.body).to.be.deep.equal({ tasks: expectedTasks });
    });
  });
});
