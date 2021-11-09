import { MongoClient } from 'mongodb';

import { IDao, FindOptions } from '..';
import { Task } from '../../models';
import { MongoService } from '../../services/database';
import { IConfigService } from '../../services';

interface IOptions {
  mongoService: MongoService;
  configService: IConfigService;
}

const COLLECTION: string = 'tasks';

export default class TaskMongoDao implements IDao<Task> {
  private configService: IConfigService;

  private mongoService: MongoService;

  constructor({ mongoService, configService }: IOptions) {
    this.mongoService = mongoService;
    this.configService = configService;
  }

  public find(query: any, { limit, offset }: FindOptions): Promise<Task[]> {
    const client: MongoClient = this.mongoService.getClient();
    const dbName: string = this.configService.get('mongo').database;
    const db = client.db(dbName);
    const collection = db.collection<Task>(COLLECTION);

    return collection.find(query, { skip: offset, limit }).toArray();
  }
}
