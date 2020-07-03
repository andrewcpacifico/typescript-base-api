import { MongoClient } from 'mongodb';

import { IConfigService, IDatabaseService, ILoggerService } from '..';
import { MongoModule } from '../../types-3rd';

interface IMongoServiceOptions {
  configService: IConfigService;
  loggerService: ILoggerService;
  mongo: MongoModule;
}

export class MongoService implements IDatabaseService {
  private configService: IConfigService;
  private loggerService: ILoggerService;
  private mongo: MongoModule;
  private mongoClient!: MongoClient;

  constructor({ mongo, configService, loggerService }: IMongoServiceOptions) {
    this.configService = configService;
    this.loggerService = loggerService;
    this.mongo = mongo;
  }

  public async connect() {
    const { host, database } = this.configService.get('mongo');

    const url = `mongodb://${host}/${database}`;

    this.loggerService.info('Connecting do mongo database');
    try {
      this.mongoClient = await this.mongo.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      this.loggerService.info('Mongo connection stablished');
    } catch (err) {
      this.loggerService.error('Error connecting to mongo.');
      throw err;
    }
  }

  public getClient(): MongoClient {
    return this.mongoClient;
  }
}
