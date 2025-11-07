export interface BasePagination<T> {
  result: T[];
  meta: {
    total: number;
    currentPage: number;
    perPage: number;
    totalNumberOfPages: number;
  };
}
