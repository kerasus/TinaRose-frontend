import BaseAPI from './BaseAPI'
import { type UserType } from './user'
import type { ListType } from './BaseAPI'
import type { ColorType } from 'src/repositories/color'
import type { ProductType } from 'src/repositories/product'
import type { InventoryType } from 'src/repositories/inventory'
import type { ProductPartType } from 'src/repositories/productPart'
import type { RawMaterialType } from 'src/repositories/rawMaterial'

export type InventoryCountType = {
  id: number | null;
  inventory: InventoryType | null;
  inventory_id: number | null;
  counter: UserType | null;
  counter_user_id: number | null;
  count_date: string | null;
  is_locked: boolean | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type InventoryCountUpdateItemType = {
  item_id: number;
  item_type: 'App\\Models\\Product' | 'App\\Models\\ProductPart' | 'App\\Models\\RawMaterial';
  color_id?: number;
  actual_quantity: number,
  notes?: string | null
}

export type InventoryCountItemType = {
  id: number | null;
  item: ProductPartType | ProductType | RawMaterialType | null;
  item_type: 'App\\Models\\Product' | 'App\\Models\\ProductPart' | 'App\\Models\\RawMaterial' | null;
  color: ColorType | null;
  system_quantity: number | null;
  actual_quantity: number | null;
  count_notes: string | null;
};

export default class InventoryCountAPI extends BaseAPI<InventoryCountType> {
  constructor () {
    super('/inventory-counts')
    this.defaultObject = {
      id: null,
      counter: null,
      counter_user_id: null,
      inventory: null,
      inventory_id: null,
      count_date: null,
      is_locked: null,
      notes: null,
      created_at: null,
      updated_at: null
    }
    this.endpoints = {
      ...this.endpoints,
      start: () => `${this.baseEndpoint}/start`,
      items: (inventoryCountId: number) => `${this.baseEndpoint}/${inventoryCountId}/items`,
      item: (inventoryCountId: number) => `${this.baseEndpoint}/${inventoryCountId}/item`,
      finalize: (inventoryCountId: number) => `${this.baseEndpoint}/${inventoryCountId}/finalize`
    }
  }

  async start (data: {
    inventory_id: number,
    count_date: string,
    counter_user_id: number
  }): Promise<InventoryCountType> {
    const response = await this.getAxiosInstanceWithToken()
      .post(this.endpoints.start, data)

    return response.data
  }

  async getInventoryItems (inventoryCountId: number, filter: {
    product_id?: number,
    product_part_id?: number,
    raw_material_id?: number,
    missing_actual?: boolean,
    per_page: number
  }): Promise<ListType<InventoryCountItemType>> {
    const response = await this.getAxiosInstanceWithToken()
      .get(this.endpoints.items(inventoryCountId), {
        params: filter
      })

    return response.data
  }

  async updateItem (inventoryCountId: number, data: InventoryCountUpdateItemType): Promise<{ message: string }> {
    const response = await this.getAxiosInstanceWithToken()
      .put(this.endpoints.item(inventoryCountId), data)

    return response.data
  }

  async finalize (inventoryCountId: number, adjustInventory: boolean = true): Promise<{ message: string }> {
    const response = await this.getAxiosInstanceWithToken()
      .post(this.endpoints.finalize(inventoryCountId), { adjust_inventory: adjustInventory })

    return response.data
  }
}
