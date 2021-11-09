import { Router } from 'express';

import { Express, JoiModule, ValidateMiddleware } from '../../types-3rd';
import { ITaskController } from '../../controllers';

type Dependencies = {
  express: Express;
  joi: JoiModule;
  taskController: ITaskController;
  validate: ValidateMiddleware;
};

export default function v1TaskRouter({
  express,
  joi,
  taskController,
  validate,
}: Dependencies): Router {
  const router = express.Router();

  router.route('/')
    .get(validate({
      query: joi.object({
        dueDate: joi.date(),
        limit: joi.number().integer().positive(),
        offset: joi.number().integer().min(0),
      }),
    }, { keyByField: true, context: true }), taskController.list);

  return router;
}
