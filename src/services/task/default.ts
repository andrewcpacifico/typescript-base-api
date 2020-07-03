import { Task } from '../../models';
import { IDao } from '../../dao';
import { GetAllOptions,  ITaskService } from '.';

const DEFAULT_OFFSET = 0;
const DEFALT_LIMIT = 10;

interface IOptions {
  taskDao: IDao<Task>,
}

export class DefaultTaskService implements ITaskService {
  private taskDao: IDao<Task>;

  constructor({ taskDao }: IOptions) {
    this.taskDao = taskDao;
  }

  getAll({
    filter,
    offset = DEFAULT_OFFSET,
    limit = DEFALT_LIMIT
  }: GetAllOptions = {}): Promise<Task[]> {
    return this.taskDao.find(filter, { offset, limit });
  }
}
