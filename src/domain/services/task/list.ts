import { Task } from '@domain/entities/task';
import { ITaskRepository } from '@domain/repositories/task';

type ListTaskArgs = {
  dueDate?: Date;
  limit?: number;
  offset?: number;
};
type TListTaskResponse = Promise<Task[]>;
export type TListTaskService = (args: ListTaskArgs) => TListTaskResponse;

export type TDependencies = {
  taskRepository: ITaskRepository;
};

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 10;

export default function listTaskServiceWrapper({
  taskRepository,
}: TDependencies): TListTaskService {
  return function listTaskService({
    dueDate,
    limit = DEFAULT_LIMIT,
    offset = DEFAULT_OFFSET,
  }) {
    return taskRepository.list({ filter: { dueDate }, limit, offset });
  };
}
