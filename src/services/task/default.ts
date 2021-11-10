import { Moment } from 'moment';

import { Task } from '../../models';
import { IDao } from '../../dao';
import { MomentModule } from '../../types-3rd';
import { GetAllOptions, ITaskService } from './task';

const DEFAULT_OFFSET = 0;
const DEFALT_LIMIT = 10;

type TDependencies = {
  moment: MomentModule;
  taskDao: IDao<Task>,
}

export default class DefaultTaskService implements ITaskService {
  constructor(private deps: TDependencies) {}

  getAll({
    filter = {},
    offset = DEFAULT_OFFSET,
    limit = DEFALT_LIMIT,
  }: GetAllOptions = {}): Promise<Task[]> {
    const { moment, taskDao } = this.deps;
    const { dueDate } = filter;
    const query: any = {};

    if (dueDate) {
      const dueDateMoment: Moment = moment.utc(dueDate).startOf('day');
      query.dueDate = {
        $gte: dueDateMoment.toDate(),
        $lte: dueDateMoment.clone().endOf('day').toDate(),
      };
    }

    return taskDao.find(query, { offset, limit });
  }
}
