import { IController, Request, Response } from '@allspark-js/rest';
import { ExpressValidator } from '@allspark-js/rest/third-party';
import { Task } from '@domain/entities/task';
import { TListTaskService } from '@domain/services/task/list';

type TDependencies = {
  taskListService: TListTaskService;
  validator: ExpressValidator;
};

type TQueryParams = {
  dueDate: Date;
  limit: number;
  offset: number;
};

type TSuccessResponse = Task[];

export default function listTasksWrapper(deps: TDependencies): IController<TSuccessResponse> {
  const { validator: { joi }, taskListService } = deps;

  return {
    async handle(req: Request<any, any, TQueryParams, any>) {
      const { limit, offset, dueDate } = req.query;
      return taskListService({ dueDate, limit, offset });
    },

    format(res: Response, data: TSuccessResponse) {
      const formatted = data.map((task) => ({
        id: task.id,
        title: task.title,
        dueDate: task.dueDate,
      }));
      res.json({ tasks: formatted });
    },

    validator: {
      query: joi.object({
        dueDate: joi.date(),
        limit: joi.number().integer().positive(),
        offset: joi.number().integer().min(0),
      }),
    },
  };
}
