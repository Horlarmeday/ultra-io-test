export class QueryParamsDto {
  readonly currentPage: number;
  readonly pageLimit?: number;
  readonly search?: string;
  readonly filterBy?: string;
  readonly sort?: string; // [ASC, DESC]
  readonly start?: Date;
  readonly end?: Date;
}
