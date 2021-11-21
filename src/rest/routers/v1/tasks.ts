import { IServer, IController } from '@allspark-js/rest';
import { ExpressValidator } from '@allspark-js/rest/third-party';

type Dependencies = {
  v1TaskListController: IController;
  validator: ExpressValidator;
  server: IServer,
};

export default function v1TaskRouter(deps: Dependencies) {
  const { server } = deps;
  const router = server.createRouter();

  const { v1TaskListController } = deps;
  router.get({
    path: '/',
    handler: v1TaskListController.handle,
    formatter: v1TaskListController.format,
    validatorSchema: v1TaskListController.validator,
  });

  return router;
}
