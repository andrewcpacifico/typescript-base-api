import {
  RestApplication,
  IServer,
  IRouter,
  TDependencyContainer as TDependencyContainerOriginal,
} from '@allspark-js/rest';

type TContainer = {
  v1MainRouter: IRouter;
  server: IServer;
}

export type TDependencyContainer = TDependencyContainerOriginal & TContainer;

export default async function main({ start = true } = {}) {
  const app = new RestApplication<TContainer>();
  app.registerDependencies();
  const container = await app.initialize();

  const { v1MainRouter, server } = container;
  server.route('/v1', v1MainRouter);

  if (start) {
    app.start();
  }

  return container;
}
