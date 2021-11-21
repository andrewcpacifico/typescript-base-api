import { RouteHandler, IServer, ResponseFormatter } from '@allspark-js/rest';
import { ExpressValidator } from '@allspark-js/rest/third-party';

type Dependencies = {
  v1TaskFormatter: ResponseFormatter;
  v1TaskHandler: RouteHandler;
  validator: ExpressValidator;
  server: IServer,
};

export default function v1TaskRouter(deps: Dependencies) {
  const { validator: { joi }, server } = deps;
  const router = server.createRouter();

  // const { v1TaskHandler, v1TaskFormatter } = deps;
  router.get({
    path: '/',
    handler: async () => { /** */ },
    formatter: (res) => { res.json('ok'); },
    validatorSchema: {
      query: joi.object({
        dueDate: joi.date(),
        limit: joi.number().integer().positive(),
        offset: joi.number().integer().min(0),
      }),
    },
  });

  return router;
}
