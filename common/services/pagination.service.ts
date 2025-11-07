import { Injectable } from '@nestjs/common';
import { FindManyOptions, ObjectLiteral, Repository } from 'typeorm';
import { PaginationQueryDto } from '../../core/dtos/pagination-query.dto';
import { BasePagination } from '../../core/interfaces/base-pagination.interface';

@Injectable()
export class PaginationService {
  private readonly DEFAULT_PER_PAGE = 25;
  emptyPaginate() {
    return {
      result: [],
      meta: {
        total: 0,
        currentPage: 1,
        perPage: this.DEFAULT_PER_PAGE,
        totalNumberOfPages: 0,
      },
    };
  }

  async paginate<T extends ObjectLiteral>(
    repository: Repository<T>,
    paginationDto: PaginationQueryDto,
    options: FindManyOptions<T> = {},
  ): Promise<BasePagination<T>> {
    const { page = 1, perPage = this.DEFAULT_PER_PAGE } = paginationDto;

    const [data, total] = await repository.findAndCount({
      skip: (page - 1) * perPage,
      take: perPage,
      ...options,
    });

    const totalPages = Math.ceil(total / perPage);

    return {
      result: data,
      meta: {
        total,
        currentPage: page,
        perPage: perPage,
        totalNumberOfPages: totalPages,
      },
    };
  }
}
