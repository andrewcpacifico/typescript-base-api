import { Express, Router } from 'express';

import { IConfigService, ILoggerService } from './services';
import { IMiddleware } from './middlewares';
import { Express as ExpressCreator } from './types-3rd';

interface Options {
  express: ExpressCreator;
  configService: IConfigService;
  loggerService: ILoggerService;
  middlewares: IMiddleware[];
  v1MainRouter: Router;
}

export interface IServer {
  start(): void;
}

export default function({
  express,
  configService,
  loggerService,
  middlewares,
  v1MainRouter,
}: Options): IServer {
  function applyMiddlewares(app: Express) {
    middlewares.forEach((middleware) => {
      app.use(middleware);
    });
  }

  function start() {
    const { port } = configService.get('server');

    const app = express();
    applyMiddlewares(app);
    app.use('/v1', v1MainRouter);

    return new Promise((resolve, reject) => {
      app.listen(port, () => {
        loggerService.info(`API listening on port ${port}`);
        resolve(undefined);
      }).on('error', (err) => {
        loggerService.error(err);
        reject(err);
      });
    });
  }

  return { start };
}
