import BaseAPI from './BaseAPI'
import type { FabricType } from 'src/repositories/fabric'

export type ColorType = {
  id: number | null;
  name: string | null;
  code: string | null;
  color_hex: string | null;
  fabric_id: number | null;
  fabric: FabricType | null;
  created_at: string | null;
  updated_at: string | null;
};

export default class ColorAPI extends BaseAPI<ColorType> {
  constructor () {
    super('/colors')
    this.defaultObject = {
      id: null,
      name: null,
      code: null,
      color_hex: null,
      fabric_id: null,
      fabric: null,
      created_at: null,
      updated_at: null
    }
  }
}
