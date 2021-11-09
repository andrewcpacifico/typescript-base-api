import { Request, Response } from 'express';

import { ITaskService } from '../services/task';
import { Task } from '../models';

export interface ITaskController {
  list(req: Request, res: Response): Promise<any>;
}

type Dependencies = {
  taskService: ITaskService;
};

type ListQueryParams = {
  offset?: number;
  limit?: number;
  dueDate?: Date;
};

export function taskControllerModule({ taskService }: Dependencies): ITaskController {
  return {
    async list(req: Request<any, any, any, ListQueryParams>, res: Response) {
      const { dueDate, offset, limit } = req.query;

      const tasks: Task[] = await taskService.getAll({
        filter: {
          dueDate,
        },
        limit,
        offset,
      });
      res.json(tasks);
    },
  };
}
