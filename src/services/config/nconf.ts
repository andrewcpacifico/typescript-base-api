import { join } from 'path';
import { Provider } from 'nconf';

import { IConfigService } from '.';

interface IConfigOptions {
  nconfProvider: Provider
  process: NodeJS.Process
}

export class NconfConfigService implements IConfigService {
  private nconfProvider: Provider;
  private process: NodeJS.Process;

  constructor({ nconfProvider, process }: IConfigOptions) {
    this.nconfProvider = nconfProvider;
    this.process = process;
  }

  public load() {
    const { env } = this.process;
    env.NODE_ENV = env.NODE_ENV || 'development';

    this.nconfProvider.file('environment', {
      file: join(__dirname, `../../../config/${process.env.NODE_ENV}.json`),
    }).file('default', {
      file: join(__dirname, '../../../config/default.json'),
    });
  }

  public get(prop: string): any {
    return this.nconfProvider.get(prop);
  }
}
