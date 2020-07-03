export { PinoLoggerService } from './pino';

export interface ILoggerService {
  init(): void;
  info(msg: any, ...args: any[]): void;
  debug(msg: any, ...args: any[]): void;
  error(msg: any, ...args: any[]): void;
};
