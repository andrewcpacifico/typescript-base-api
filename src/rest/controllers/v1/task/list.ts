import { IController, Request, Response } from '@allspark-js/rest';
import { ExpressValidator } from '@allspark-js/rest/third-party';

type TDependencies = {
  validator: ExpressValidator;
};

type TQueryParams = {
  dueDate: Date;
  limit: number;
  offset: number;
};

type TSuccessResponse = {
  limit: number;
};

export default function listTasksWrapper(deps: TDependencies): IController<TSuccessResponse> {
  const { validator: { joi } } = deps;

  return {
    async handle(req: Request<any, any, TQueryParams, any>) {
      return { limit: req.query.limit };
    },

    format(res: Response, data: TSuccessResponse) {
      res.json(data);
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
