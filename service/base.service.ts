import {
  FindOptionsOrder,
  FindOptionsSelect,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';

export interface BaseFindOptions<T> {
  select?: FindOptionsSelect<T>;
  where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
  order?: FindOptionsOrder<T>;
  relations?: string[];
  skip?: number;
  take?: number;
}

export class BaseService<T extends ObjectLiteral> {
  constructor(private readonly repository: Repository<T>) {}

  async find(options: BaseFindOptions<T> = {}): Promise<T[]> {
    const { select, where, order, relations, skip, take } = options;

    return this.repository.find({
      ...(select && { select }),
      ...(where && { where }),
      ...(order && { order }),
      ...(relations && { relations }),
      ...(typeof skip === 'number' && { skip }),
      ...(typeof take === 'number' && { take }),
    });
  }

  async findOne(
    options: Omit<BaseFindOptions<T>, 'skip' | 'take'> = {},
  ): Promise<T | null> {
    const { select, where, order, relations } = options;

    return this.repository.findOne({
      ...(select && { select }),
      ...(where && { where }),
      ...(order && { order }),
      ...(relations && { relations }),
    });
  }
}
