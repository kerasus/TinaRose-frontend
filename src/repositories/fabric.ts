import BaseAPI from './BaseAPI';

export type FabricType = {
  id: number | null;
  name: string | null;
  color_hex: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export default class FabricAPI extends BaseAPI<FabricType> {
  constructor() {
    super('/fabrics');
    this.defaultObject = {
      id: null,
      name: null,
      color_hex: null,
      created_at: null,
      updated_at: null
    };
  }
}
