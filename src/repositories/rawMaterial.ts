import BaseAPI from './BaseAPI';

export type RawMaterialType = {
  id: number | null;
  name: string | null;
  code: string | null;
  unit_large: string | null;
  unit_small: string | null;
  conversion_rate: number | null;
  initial_stock: number | null;
  created_at: string | null;
  updated_at: string | null;
};

export default class RawMaterialAPI extends BaseAPI<RawMaterialType> {
  constructor() {
    super('/raw-materials');
    this.defaultObject = {
      id: null,
      name: null,
      code: null,
      unit_large: null,
      unit_small: null,
      conversion_rate: null,
      initial_stock: null,
      created_at: null,
      updated_at: null
    };
  }
}
