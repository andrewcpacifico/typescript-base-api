import { Router } from 'express';

import { Express } from '../../types-3rd';

interface IOptions {
  express: Express;
  v1TaskRouter: Router;
}

export default function v1MainRouter({ express, v1TaskRouter }: IOptions): Router {
  const router = express.Router();

  router.get('/health', (_req, res) => {
    res.sendStatus(200);
  });

  router.use('/tasks', v1TaskRouter);

  return router;
}
