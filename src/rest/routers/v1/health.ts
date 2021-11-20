import { IServer } from '@allspark-js/rest';

type Dependencies = {
  server: IServer,
};

export default function v1HealthRouter({ server }: Dependencies) {
  const router = server.createRouter();

  router.get({
    path: '/',
    handler: async () => { /* do nothing */ },
    formatter: async (res) => res.json('ok'),
  });

  return router;
}
