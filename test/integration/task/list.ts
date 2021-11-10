import { expect } from 'chai';
import { Express } from 'express';
import { ObjectId } from 'mongodb';
import request from 'supertest';

import server from '../../../src/server';
import { DependencyContainer } from '../../../src/dependency-container';

function getCollection(collection: string, container: DependencyContainer) {
  const { configService, mongoService } = container;
  const mongoClient = mongoService.getClient();
  const db = mongoClient.db(configService.get('mongo:database'));

  return db.collection(collection);
}

describe('Tasks', function () {
  let app: Express;
  let dependencyContainer: DependencyContainer;

  before(async function () {
    await server.initialize();
    const serverResult = await server.start();
    app = serverResult.expressApp;
    dependencyContainer = serverResult.dependencyContainer;
  });

  after(async function () {
    const { mongoService } = dependencyContainer;

    await mongoService.disconnet();
  });

  describe('GET /v1/tasks', function () {
    const tasks = [
      {
        _id: new ObjectId(),
        title: 'task 1',
        createdAt: new Date(),
        dueDate: new Date('2020-10-01T01:00:00.000Z'),
      },
      {
        _id: new ObjectId(),
        title: 'task 2',
        createdAt: new Date(),
        dueDate: new Date('2020-10-01T00:00:00.000Z'),
      },
      {
        _id: new ObjectId(),
        title: 'task 3',
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        title: 'task 4',
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        title: 'task 5',
        createdAt: new Date(),
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
        _id, title, createdAt, dueDate,
      }) => ({
        _id: _id.toHexString(),
        title,
        ...(dueDate !== undefined) && { dueDate: dueDate.toISOString() },
        ...(createdAt !== undefined) && { createdAt: createdAt.toISOString() },
      }));

      const res = await request(app)
        .get('/v1/tasks');

      expect(res.status).to.be.equal(200);
      expect(res.header['Content-Type'], 'application/json');
      expect(res.body).to.be.deep.equal(expectedTasks);
    });

    it('should slice result using limit parameter', async function () {
      const expectedTasks = tasks.map(({
        _id, title, createdAt, dueDate,
      }) => ({
        _id: _id.toHexString(),
        title,
        ...(dueDate !== undefined) && { dueDate: dueDate.toISOString() },
        ...(createdAt !== undefined) && { createdAt: createdAt.toISOString() },
      })).slice(0, 2);

      const res = await request(app)
        .get('/v1/tasks?limit=2');

      expect(res.status).to.be.equal(200);
      expect(res.header['Content-Type'], 'application/json');
      expect(res.body).to.be.deep.equal(expectedTasks);
    });

    it('should paginate correctly', async function () {
      const expectedTasks = tasks.map(({
        _id, title, createdAt, dueDate,
      }) => ({
        _id: _id.toHexString(),
        title,
        ...(dueDate !== undefined) && { dueDate: dueDate.toISOString() },
        ...(createdAt !== undefined) && { createdAt: createdAt.toISOString() },
      })).slice(2, 4);

      const res = await request(app)
        .get('/v1/tasks?limit=2&offset=2');

      expect(res.status).to.be.equal(200);
      expect(res.header['Content-Type'], 'application/json');
      expect(res.body).to.be.deep.equal(expectedTasks);
    });

    it('should filter by dueDate', async function () {
      const expectedTasks = tasks.map(({
        _id, title, createdAt, dueDate,
      }) => ({
        _id: _id.toHexString(),
        title,
        ...(dueDate !== undefined) && { dueDate: dueDate.toISOString() },
        ...(createdAt !== undefined) && { createdAt: createdAt.toISOString() },
      })).filter((task) => !!task.dueDate);

      const res = await request(app)
        .get('/v1/tasks?dueDate=2020-10-01');

      expect(res.status).to.be.equal(200);
      expect(res.header['Content-Type'], 'application/json');
      expect(res.body).to.be.deep.equal(expectedTasks);
    });
  });
});
