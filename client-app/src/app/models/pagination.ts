export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export class PaginatedResult<T> {
  constructor(public data: T, public pagination: Pagination) {}
}

export class PagingParams {
  pageNumber = 1;
  // temp
  pageSize = 2;
}
