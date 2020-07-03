export type FindOptions = {
  offset?: number,
  limit?: number
}

export interface IDao<T> {
  find(query: any, opts?: FindOptions): Promise<T[]>;
}
