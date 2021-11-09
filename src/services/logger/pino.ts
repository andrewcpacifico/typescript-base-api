import { P } from 'pino';

import { IConfigService, ILoggerService } from '..';
import { Pino } from '../../types-3rd';

interface IPinoLoggerOptions {
  configService: IConfigService;
  pino: Pino;
}

export class PinoLoggerService implements ILoggerService {
  public pinoLogger!: P.Logger;

  constructor(private deps: IPinoLoggerOptions) {}

  init(): void {
    const { configService, pino } = this.deps;
    this.pinoLogger = pino(configService.get('logger'));
  }

  info(msg: any, ...args: any[]): void {
    this.pinoLogger.info(msg, ...args);
  }

  debug(msg: any, ...args: any[]): void {
    this.pinoLogger.debug(msg, ...args);
  }

  error(msg: any, ...args: any[]): void {
    this.pinoLogger.error(msg, ...args);
  }
}
