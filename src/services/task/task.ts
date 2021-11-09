import { Task } from '../../models';

export type GetTasksFilter = {
  dueDate?: Date;
};

export type GetAllOptions = {
  filter?: GetTasksFilter;
  offset?: number;
  limit?: number;
};

export interface ITaskService {
  getAll(options?: GetAllOptions): Promise<Task[]>;
}
