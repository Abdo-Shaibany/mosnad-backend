export interface Pagination<T> {
  items: T[];
  pagination: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
  };
}

export interface Filter {
  field: string;
  condition: 'equals' | 'not';
  value: string;
}

export interface PagedRequest {
  pagination: {
    pageSize: number;
    currentPage: number;
  };
  search?: string;
}

export interface FetchAllResponse {
  id: number;
  text: string;
}
