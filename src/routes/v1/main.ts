import { Router } from 'express';

import { Express } from '../../types-3rd';

interface IOptions {
  express: Express;
  v1TaskRouter: Router;
}

export function v1MainRouter({ express, v1TaskRouter }: IOptions): Router {
  const router = express.Router();

  router.get('/health', ({}, res) => {
    res.sendStatus(200);
  });

  router.use('/tasks', v1TaskRouter);

  return router;
}
