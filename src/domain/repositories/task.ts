/* eslint-disable no-underscore-dangle */
import { IConfigManager, IMongoManager } from '@allspark-js/core';
import { MomentModule } from '@allspark-js/core/third-party';

import { Task } from '@domain/entities/task';

type TDependencies = {
  configManager: IConfigManager,
  moment: MomentModule,
  mongoManager: IMongoManager
};

type TListTaskArgs = {
  filter?: {
    dueDate?: Date;
  };
  limit: number;
  offset: number;
};

const COLLECTION = 'tasks';

export interface ITaskRepository {
  list(args: TListTaskArgs): Promise<Task[]>;
}

type TDBTask = {
  _id: string;
  dueDate: Date;
  title: string;
};

export default class TaskRepository implements ITaskRepository {
  constructor(private deps: TDependencies) {}

  private static formatTask(dbTask: TDBTask): Task {
    return {
      id: dbTask._id,
      dueDate: dbTask.dueDate,
      title: dbTask.title,
    };
  }

  async list({ filter = {}, limit, offset }: TListTaskArgs): Promise<Task[]> {
    const { configManager, moment, mongoManager } = this.deps;
    const { dueDate } = filter;

    const client = mongoManager.getClient();
    const dbName: string = configManager.get('mongo:database');
    const db = client.db(dbName);
    const collection = db.collection<TDBTask>(COLLECTION);

    const query: any = {};
    if (dueDate) {
      const dueDateMoment = moment.utc(dueDate).startOf('day');
      query.dueDate = {
        $gte: dueDateMoment.toDate(),
        $lte: dueDateMoment.clone().endOf('day').toDate(),
      };
    }

    const tasks = await collection.find(query, { skip: offset, limit }).toArray();
    return tasks.map(TaskRepository.formatTask);
  }
}
