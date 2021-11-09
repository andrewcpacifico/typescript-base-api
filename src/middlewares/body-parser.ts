import { IMiddleware } from './middleware';
import { BodyParser } from '../types-3rd';

interface IOptions {
  bodyParser: BodyParser;
}

export default function bodyParserMiddleware({ bodyParser }: IOptions): IMiddleware {
  return (req, res, next) => {
    const jsonHandler = bodyParser.json();
    jsonHandler(req, res, next);
  };
}
