import BaseAPI from './BaseAPI';
import { type UserType } from './user';
import type { ListType } from './BaseAPI';
import type { ProductType } from 'src/repositories/product';
import type { RawMaterialType } from 'src/repositories/rawMaterial';
import type { ProductPartType } from 'src/repositories/productPart';

export type InventoryType = {
  id: number | null;
  user: UserType | null;
  user_id: number | null;
  type: inventoryTypeType | null;
  items: InventoryItemType[];
  name: string | null;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type InventoryItemType = {
  id: number | null;
  inventory_id: number | null;
  item_id: number | null;
  item: ProductPartType | ProductType | RawMaterialType | null;
  item_type: 'App\\Models\\Product' | 'App\\Models\\ProductPart' | 'App\\Models\\RawMaterial' | null;
  type: inventoryTypeType | null;
  quantity: number | null;
  current_stock: number | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type inventoryTypeType = 'fabric_cutter' |'coloring_worker' |'molding_worker' |'assembler' |'central_warehouse'

export const inventoryTypeOptions = [
  {
    label: 'برش کاری',
    value: 'fabric_cutter'
  },
  {
    label: 'رنگ کاری',
    value: 'coloring_worker'
  },
  {
    label: 'اتو کاری',
    value: 'molding_worker'
  },
  {
    label: 'مونتاژ کاری',
    value: 'assembler'
  },
  {
    label: 'مرکزی',
    value: 'central_warehouse'
  }
]

export default class InventoryAPI extends BaseAPI<InventoryType> {
  constructor() {
    super('/inventories');
    this.defaultObject = {
      id: null,
      user_id: null,
      user: null,
      type: null,
      name: null,
      items: [],
      description: null,
      created_at: null,
      updated_at: null
    };
    this.endpoints = {
      ...this.endpoints,
      items: (inventoryId: number) => `${this.baseEndpoint}/${inventoryId}/items`,
    }
  }

  async getItems(inventoryId: number): Promise<ListType<InventoryItemType>> {
    const response = await this.getAxiosInstanceWithToken()
      .get(this.endpoints.items(inventoryId));

    return {
      data: response.data.data,
      from: response.data.from,
      to: response.data.to,
      current_page: response.data.current_page,
      per_page: response.data.per_page,
      total: response.data.total,
    }
  }
}
