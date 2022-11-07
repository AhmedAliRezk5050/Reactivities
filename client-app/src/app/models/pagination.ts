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
  constructor(public pageNumber = 1, public pageSize = 2) {}
}
