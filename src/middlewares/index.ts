import { Request, Response, NextFunction} from 'express';

export { bodyParserMiddleware } from './body-parser';

export type IMiddleware = (req: Request, res: Response, next: NextFunction) => void;
