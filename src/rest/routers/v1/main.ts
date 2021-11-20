import { IRouter, IServer } from '@allspark-js/rest';

type Dependencies = {
  v1HealthRouter: IRouter;
  server: IServer;
};

export default function v1MainRouter({
  v1HealthRouter,
  server,
}: Dependencies): IRouter {
  const router = server.createRouter();

  router.route('/health', v1HealthRouter);

  return router;
}
