export interface IDatabaseService {
  connect(): void;
  disconnet(): Promise<void>;
  getClient(): any;
}
