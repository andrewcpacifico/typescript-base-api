import { Express } from 'express';

import { DependencyContainer, registerDependencies } from './dependency-container';

const dependencyContainer: DependencyContainer = registerDependencies();

export type TServerResult = {
  expressApp: Express;
  dependencyContainer: DependencyContainer;
}

export interface IServer {
  initialize(): Promise<void>;
  start(): Promise<TServerResult>;
}

function applyMiddlewares(app: Express) {
  const { middlewares } = dependencyContainer;

  middlewares.forEach((middleware) => {
    app.use(middleware);
  });
}

const server: IServer = {
  async initialize() {
    const {
      configService,
      databaseService,
      loggerService,
    } = dependencyContainer;

    configService.load();
    loggerService.init();
    await databaseService.connect();
  },

  start() {
    const {
      configService,
      express,
      loggerService,
      v1MainRouter,
    } = dependencyContainer;

    console.log('starting...');
    const { port } = configService.get('server');

    const app = express();
    applyMiddlewares(app);
    app.use('/v1', v1MainRouter);

    return new Promise((resolve, reject) => {
      app.listen(port, () => {
        loggerService.info(`API listening on port ${port}`);
        resolve({ expressApp: app, dependencyContainer });
      }).on('error', (err) => {
        loggerService.error(err);
        reject(err);
      });
    });
  },
};

export default server;
