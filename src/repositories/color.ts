import BaseAPI from './BaseAPI';

export type ColorType = {
  id: number | null;
  name: string | null;
  color_hex: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export default class ColorAPI extends BaseAPI<ColorType> {
  constructor() {
    super('/colors');
    this.defaultObject = {
      id: null,
      name: null,
      color_hex: null,
      created_at: null,
      updated_at: null
    };
  }
}
