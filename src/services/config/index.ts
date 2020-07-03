export { NconfConfigService } from './nconf';

export interface IConfigService {
  get(property: string): any;
  load(): void;
}
