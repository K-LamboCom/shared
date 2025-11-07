import { ClassTransformOptions, plainToInstance } from 'class-transformer';

export abstract class BaseResponse {
  static fromEntity<T, E>(
    this: new () => T,
    entity: E,
    opts?: ClassTransformOptions,
  ): T {
    return plainToInstance(this, entity, opts);
  }

  static fromEntities<T, E>(
    this: new () => T,
    entities: E[],
    opts?: ClassTransformOptions,
  ): T[] {
    return plainToInstance(this, entities, opts);
  }
}
