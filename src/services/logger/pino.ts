import { Logger as PinoInternalLogger } from 'pino';
import { IConfigService, ILoggerService } from '..';

interface IPinoLoggerOptions {
  configService: IConfigService;
  pino: any;
}

export class PinoLoggerService implements ILoggerService {
  private configService: IConfigService;
  private pino: any;

  public pinoLogger!: PinoInternalLogger;

  constructor({ configService, pino }: IPinoLoggerOptions) {
    this.configService = configService;
    this.pino = pino;
  }

  init(): void {
    this.pinoLogger = this.pino(this.configService.get('logger'));
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
