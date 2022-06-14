export class GeneralHelpers {
  paginate(
    data: any,
    page: number,
    limit: number,
  ): {
    total: number;
    pages: number;
    perPage: number;
    docs: any;
    currentPage: number;
  } {
    const { count: total, rows: docs } = data;
    const currentPage = page || 1;
    const pages = Math.ceil(total / limit);
    const perPage = limit;

    return { total, docs, pages, perPage, currentPage };
  }

  getPagination(page: number, size: number): { offset: number; limit: number } {
    const limit = size || 10;
    const offset = page ? (page - 1) * limit : 0;

    return { limit, offset };
  }

  applyDiscount(price: number): number {
    const discount = price * 0.2;
    return price - discount;
  }

  async processArray(array, delayedLog) {
    console.log('Update Starting...');
    const promises = array.map(delayedLog);
    // wait until all promises are resolved
    await Promise.all(promises);
  }
}
