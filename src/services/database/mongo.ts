import { MongoClient } from 'mongodb';

import { IConfigService, IDatabaseService, ILoggerService } from '..';
import { MongoModule } from '../../types-3rd';

interface IMongoServiceOptions {
  configService: IConfigService;
  loggerService: ILoggerService;
  mongo: MongoModule;
}

export default class MongoService implements IDatabaseService {
  private mongoClient!: MongoClient;

  constructor(private deps: IMongoServiceOptions) {}

  public async connect() {
    const { configService, loggerService, mongo } = this.deps;
    const { host, database } = configService.get('mongo');

    const url = `mongodb://${host}/${database}`;

    console.log('connectng...', url);
    loggerService.info('Connecting do mongo database');
    try {
      this.mongoClient = await mongo.MongoClient.connect(url);
      loggerService.info('Mongo connection stablished');
    } catch (err) {
      console.log(err);
      loggerService.error('Error connecting to mongo.');
      throw err;
    }
  }

  public disconnet(): Promise<void> {
    return this.mongoClient.close();
  }

  public getClient(): MongoClient {
    return this.mongoClient;
  }
}
