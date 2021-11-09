export interface IConfigService {
  get(property: string): any;
  load(): void;
}
