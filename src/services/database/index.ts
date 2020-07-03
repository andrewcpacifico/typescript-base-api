export { MongoService } from './mongo';

export interface IDatabaseService {
  connect(): void;
};
