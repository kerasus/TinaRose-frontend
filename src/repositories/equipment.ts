import BaseAPI from './BaseAPI'

export type EquipmentType = {
  id: number | null;
  title: string | null;
  code: string | null;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export default class EquipmentAPI extends BaseAPI<EquipmentType> {
  constructor () {
    super('/equipments')
    this.defaultObject = {
      id: null,
      title: null,
      code: null,
      description: null,
      created_at: null,
      updated_at: null
    }
  }
}
