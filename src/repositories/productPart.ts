import BaseAPI from './BaseAPI';

export type ProductPartType = {
  id: number | null;
  name: string | null;
  code: string | null;
  count_per_bunch: number | null;
  initial_stock: number | null;
  created_at: string | null;
  updated_at: string | null;
};

export default class ProductPartAPI extends BaseAPI<ProductPartType> {
  constructor() {
    super('/product-parts');
    this.defaultObject = {
      id: null,
      name: null,
      code: null,
      count_per_bunch: null,
      initial_stock: null,
      created_at: null,
      updated_at: null
    };
  }
}
