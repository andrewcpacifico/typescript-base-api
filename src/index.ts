import { RestApplication, IServer, IRouter } from '@allspark-js/rest';

type Container = {
  v1MainRouter: IRouter;
  server: IServer;
}

const app = new RestApplication();
app.registerDependencies();
app.initialize((container: Container) => {
  const { v1MainRouter, server } = container;

  server.route('/v1', v1MainRouter);
});
app.start();
